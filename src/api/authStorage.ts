/**
 * Сессия в памяти вкладки.
 *
 * Refresh-токен сюда не попадает вообще: его хранит браузер в httpOnly-куке,
 * которую JS не читает. Access-токен живёт только в этом модуле — при
 * перезагрузке страницы он теряется, и сессия поднимается заново через
 * `POST /auth/refresh` (см. bootstrap в AuthContext). Ничего не пишем в
 * localStorage: то, что там лежит, доступно любому XSS.
 */

/** Насколько раньше истечения считаем токен протухшим (мс). */
const EXPIRY_SKEW_MS = 60_000;

const CHANNEL_NAME = 'ipb-auth';

export interface Session {
  access_token: string;
  /** Время жизни access-токена в секундах, как его отдаёт бэкенд. */
  expires_in: number;
}

let accessToken: string | null = null;
/** Абсолютное время истечения access-токена (epoch ms). */
let expiresAt = 0;

/**
 * Кросс-вкладочная синхронизация. Раньше её бесплатно давал общий localStorage:
 * выход в одной вкладке видели все. Теперь состояние у каждой вкладки своё,
 * поэтому о входе и выходе сообщаем явно.
 */
export type AuthBroadcast = 'login' | 'logout';

const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);

export const authStorage = {
  getAccessToken: () => accessToken,

  hasSession: () => accessToken !== null,

  setSession: (session: Session) => {
    accessToken = session.access_token;
    expiresAt = Date.now() + session.expires_in * 1000;
  },

  /** Сколько миллисекунд осталось до истечения; 0, если сессии нет. */
  msUntilExpiry: () => (accessToken ? Math.max(0, expiresAt - Date.now()) : 0),

  /** Токен истёк или истечёт в ближайшую минуту — пора обновляться заранее. */
  isExpiringSoon: () => accessToken !== null && Date.now() >= expiresAt - EXPIRY_SKEW_MS,

  clear: () => {
    accessToken = null;
    expiresAt = 0;
  },

  broadcast: (kind: AuthBroadcast) => channel?.postMessage(kind),

  /** Подписка на события из других вкладок. Возвращает функцию отписки. */
  subscribe: (handler: (kind: AuthBroadcast) => void) => {
    if (!channel) return () => {};
    const listener = (e: MessageEvent<AuthBroadcast>) => handler(e.data);
    channel.addEventListener('message', listener);
    return () => channel.removeEventListener('message', listener);
  },
};

export { EXPIRY_SKEW_MS };
