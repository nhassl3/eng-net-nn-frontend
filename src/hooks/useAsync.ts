import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveErrorMessage } from '../api/errors'

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * apiFetch кидает ApiError (или Error('SESSION_EXPIRED')) и уже разослал
 * 'auth:session-expired'. AuthContext чистит юзера, RequireAdmin показывает 403 —
 * здесь нужен только переведённый текст, см. resolveErrorMessage.
 */
export function toMessage(err: unknown): string {
  return resolveErrorMessage(err);
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

export interface PaginatedResult<T> {
  items: T[];
}

export interface PaginatedList<T> {
  items: T[];
  status: AsyncStatus;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

/**
 * Инкрементальная подгрузка страницами (limit/offset). Для табов со списками.
 *
 * Признак «есть ещё страницы» — полнота последней страницы: пришло меньше
 * запрошенного → список исчерпан. Общего числа записей API не отдаёт, и оно не нужно:
 * счётчик в UI показывает, сколько уже загружено (см. hasMore для суффикса «+»).
 *
 * `getKey` — опциональный ключ элемента: по нему страницы склеиваются без дублей.
 * Offset-пагинация плывёт, если между страницами кто-то создал/удалил запись,
 * так что без дедупликации в списке могут появиться повторы (и одинаковые React-ключи).
 */
export function usePaginatedList<T>(
  fetcher: (params: { limit: number; offset: number }) => Promise<PaginatedResult<T>>,
  pageSize: number,
  deps: React.DependencyList,
  getKey?: (item: T) => string | number,
): PaginatedList<T> {
  const [items, setItems] = useState<T[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [exhausted, setExhausted] = useState(false);
  const [tick, setTick] = useState(0);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const getKeyRef = useRef(getKey);
  getKeyRef.current = getKey;

  // loadMore должен быть стабилен по идентичности (от него зависит IntersectionObserver),
  // поэтому актуальное состояние читаем из ref, а не из замыкания.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const loadingMoreRef = useRef(loadingMore);
  loadingMoreRef.current = loadingMore;
  const exhaustedRef = useRef(exhausted);
  exhaustedRef.current = exhausted;

  // Растёт при каждой перезагрузке — догоняющие ответы loadMore от старого списка отбрасываются
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    setStatus('loading');
    setError(null);

    // После мутации (refreshAdminLists) не сбрасываем прогресс до первой страницы:
    // просим столько же записей, сколько уже было показано.
    const limit = Math.max(pageSize, itemsRef.current.length);

    fetcherRef.current({ limit, offset: 0 })
      .then((res) => {
        if (requestId !== requestIdRef.current) return;
        setItems(res.items);
        setExhausted(res.items.length < limit);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(toMessage(err));
        setStatus('error');
      });

    return () => { requestIdRef.current++; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  // Единственный признак «есть ещё» — полнота последней страницы: пришла неполная,
  // значит данные кончились. Общее число записей от бэкенда для этого не требуется.
  const hasMore = status === 'success' && !exhausted;

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current || exhaustedRef.current) return;

    const requestId = requestIdRef.current;
    setLoadingMore(true);
    fetcherRef.current({ limit: pageSize, offset: itemsRef.current.length })
      .then((res) => {
        if (requestId !== requestIdRef.current) return; // список успели перезагрузить.
        // Без этого сентинел остаётся во вьюпорте и вызывает loadMore бесконечно.
        if (res.items.length < pageSize) setExhausted(true);
        setItems((prev) => mergePages(prev, res.items, getKeyRef.current));
      })
      .catch((err: unknown) => {
        if (requestId !== requestIdRef.current) return;
        setError(toMessage(err));
      })
      .finally(() => setLoadingMore(false));
  }, [pageSize]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { items, status, error, hasMore, loadingMore, loadMore, reload };
}

function mergePages<T>(prev: T[], next: T[], getKey?: (item: T) => string | number): T[] {
  if (!getKey) return [...prev, ...next];
  const seen = new Set(prev.map(getKey));
  return [...prev, ...next.filter((item) => !seen.has(getKey(item)))];
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
