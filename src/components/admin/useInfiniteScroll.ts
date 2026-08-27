import { useEffect, useRef } from 'react'

/**
 * Бесконечный скролл для списков админки: возвращает ref для сентинела,
 * который нужно отрендерить в конце списка.
 *
 * `onLoadMore` должен быть стабилен по идентичности (usePaginatedList.loadMore таков),
 * иначе наблюдатель будет пересоздаваться на каждом рендере.
 */
export function useInfiniteScroll(enabled: boolean, onLoadMore: () => void) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !enabled) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, onLoadMore]);

  return sentinelRef;
}
