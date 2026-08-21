import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * apiFetch кидает Error('SESSION_EXPIRED') и уже разослал 'auth:session-expired'.
 * AuthContext чистит юзера, RequireAdmin показывает 403 — здесь нужен только текст.
 */
function toMessage(err: unknown): string {
  if (!(err instanceof Error)) return 'Неизвестная ошибка';
  if (err.message === 'SESSION_EXPIRED') return 'Сессия истекла. Войдите заново.';
  if (err.message === 'Failed to fetch') return 'Сервер недоступен. Проверьте подключение.';
  return err.message;
}

export interface ApiResource<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
  reload: () => void;
}

/** Загружает данные при монтировании и при изменении deps. Для табов. */
export function useApiResource<T>(fetcher: () => Promise<T>, deps: React.DependencyList): ApiResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // fetcher обычно пересоздаётся каждый рендер — держим в ref, чтобы не гонять эффект
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setError(null);

    fetcherRef.current()
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(toMessage(err));
        setStatus('error');
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, status, error, reload };
}

interface AsyncAction<TArgs extends unknown[], TResult> {
  run: (...args: TArgs) => Promise<TResult | undefined>;
  status: AsyncStatus;
  error: string | null;
  data: TResult | null;
  reset: () => void;
}

/** Запускается вручную. Для сабмитов в модалках. `run` не бросает. */
export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
): AsyncAction<TArgs, TResult> {
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TResult | null>(null);

  const actionRef = useRef(action);
  actionRef.current = action;

  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const run = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setStatus('loading');
    setError(null);
    try {
      const res = await actionRef.current(...args);
      if (mounted.current) {
        setData(res);
        setStatus('success');
      }
      return res;
    } catch (err: unknown) {
      if (mounted.current) {
        setError(toMessage(err));
        setStatus('error');
      }
      return undefined;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setData(null);
  }, []);

  return { run, status, error, data, reset };
}
