/**
 * Единая точка перевода серверных ошибок на русский язык.
 * Сервер отдаёт `{"message": "...", "code": "..."}` (code — опционально, для старого бэкенда).
 */
export class ApiError extends Error {
  status: number;
  code: string | null;
  serverMessage: string | null;

  constructor(status: number, code: string | null, serverMessage: string | null) {
    super(code ?? serverMessage ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.serverMessage = serverMessage;
  }
}

/** code (новый бэкенд) → русский текст */
const ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'Пользователь не найден',
  USER_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  PLAN_REQUEST_ALREADY_EXISTS: 'Такая заявка уже существует',
  PLAN_REQUEST_NOT_FOUND: 'Заявка не найдена',
  VACANCIES_NOT_FOUND: 'Вакансии не найдены',
  VACANCY_NOT_FOUND: 'Вакансия не найдена',
  VACANCIES_ALREADY_EXIST: 'Такие вакансии уже существуют',
  VACANCIES_ALREADY_RESPOND: 'Вы уже откликнулись на эту вакансию',
  INVALID_CREDENTIALS: 'Неверный логин или пароль',
  REDIS_NOT_FOUND: 'Внутренняя ошибка сервера. Попробуйте позже',
  DIRECTION_NOT_FOUND: 'Направление не найдено',
  // Реально прилетает кандидату при повторном отклике на ту же вакансию (уникальный индекс
  // email+vacancy_id) — VACANCIES_ALREADY_RESPOND в коде объявлен, но бэкенд его не возвращает.
  RESPOND_ALREADY_EXISTS: 'Вы уже откликнулись на эту вакансию',
  FILE_REQUIRED: 'Прикрепите резюме',
  VACANCY_ALREADY_EXISTS: 'Такая вакансия уже существует',
  RESPOND_VACANCIES_NOT_FOUND: 'Отклики на вакансии не найдены',
  RESPOND_VACANCY_NOT_FOUND: 'Отклик на вакансию не найден',
  FILE_TOO_LARGE: 'Файл слишком большой',
  INVALID_CONTENT_TYPE: 'Недопустимый тип файла',
  DIRECTION_HAS_VACANCIES: 'Закройте вакансии с этим профилем перед его удалением',
  BAD_REQUEST: 'Некорректный запрос',
  VALIDATION_FAILED: 'Проверьте правильность заполнения формы',
  INTERNAL: 'Внутренняя ошибка сервера. Попробуйте позже',
  TOKEN_EXPIRED: 'Сессия истекла. Войдите заново.',
  INVALID_TOKEN: 'Неверный токен. Войдите заново.',
  TOKEN_REVOKED: 'Сессия была завершена. Войдите заново.',
  CROSS_SITE_BLOCKED: 'Запрос заблокирован политикой безопасности браузера. Попробуйте открыть сайт в отдельной вкладке.',
  INVALID_PARAM: 'Некорректный параметр запроса',
};

/**
 * Совместимость со старым бэкендом, который отдаёт только англоязычный `message`
 * без `code`. TODO: удалить, когда бэкенд с кодами выкатится в прод.
 */
const LEGACY_MESSAGE_CODES: Record<string, string> = {
  'user not exists': 'USER_NOT_FOUND',
  'user already exists': 'USER_ALREADY_EXISTS',
  'plan request already exists': 'PLAN_REQUEST_ALREADY_EXISTS',
  'plan request does not exists': 'PLAN_REQUEST_NOT_FOUND',
  'vacancies not exists': 'VACANCIES_NOT_FOUND',
  'vacancy not exists': 'VACANCY_NOT_FOUND',
  'vacancies already exists': 'VACANCIES_ALREADY_EXIST',
  'vacancies already respond': 'VACANCIES_ALREADY_RESPOND',
  'invalid credentials': 'INVALID_CREDENTIALS',
  'redis not found': 'REDIS_NOT_FOUND',
  'direction not found': 'DIRECTION_NOT_FOUND',
  'respond already exists': 'RESPOND_ALREADY_EXISTS',
  'vacancy already exists': 'VACANCY_ALREADY_EXISTS',
  'respond vacancies does not exists': 'RESPOND_VACANCIES_NOT_FOUND',
  'respond vacancy does not exists': 'RESPOND_VACANCY_NOT_FOUND',
  'file too large': 'FILE_TOO_LARGE',
  'invalid content type': 'INVALID_CONTENT_TYPE',
  'conflict with already created vacancies': 'DIRECTION_HAS_VACANCIES',
  'file is required': 'FILE_REQUIRED',
  'invalid json body': 'BAD_REQUEST',
  'expired token': 'TOKEN_EXPIRED',
  'invalid token': 'INVALID_TOKEN',
  'token revoked': 'TOKEN_REVOKED',
  'cross-site request blocked': 'CROSS_SITE_BLOCKED',
  'invalid param': 'INVALID_PARAM',
};

/** Запасной перевод по HTTP-статусу, если код/строка не распознаны */
const STATUS_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Неверный логин или пароль',
  403: 'Доступ запрещён',
  404: 'Не найдено',
  409: 'Конфликт данных',
  413: 'Файл слишком большой',
  415: 'Недопустимый тип файла',
  500: 'Внутренняя ошибка сервера. Попробуйте позже',
};

export function resolveErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    // Некоторые ручки бэкенда (напр. respond) кладут в `code` не код, а человеческий текст
    // ошибки (баг конкретного хендлера — см. internal/transport/gin-http/errors.go) — поэтому
    // сырой `code` тоже прогоняем через LEGACY_MESSAGE_CODES, а не только `serverMessage`.
    const candidates = [
      err.code,
      err.code ? LEGACY_MESSAGE_CODES[err.code] : undefined,
      err.serverMessage ? LEGACY_MESSAGE_CODES[err.serverMessage] : undefined,
    ];
    for (const code of candidates) {
      if (code && ERROR_MESSAGES[code]) return ERROR_MESSAGES[code];
    }
    if (STATUS_MESSAGES[err.status]) return STATUS_MESSAGES[err.status];
    return err.serverMessage ?? `HTTP ${err.status}`;
  }
  if (!(err instanceof Error)) return 'Неизвестная ошибка';
  if (err.message === 'SESSION_EXPIRED') return 'Сессия истекла. Войдите заново.';
  if (err.message === 'Failed to fetch') return 'Сервер недоступен. Проверьте подключение.';
  return err.message;
}
