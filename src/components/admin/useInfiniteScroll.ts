import { useEffect, useRef } from 'react'

/**
 * Бесконечный скролл для списков админки: возвращает ref для сентинела,
 * который нужно отрендерить в конце списка.
 *
 * `onLoadMore` должен быть стабилен по идентичности (usePaginatedList.loadMore таков),
 * иначе наблюдатель будет пересоздаваться на каждом рендере.
 *
 * `root` — скроллящийся предок сентинела (по умолчанию `null` = вьюпорт страницы). Без него
 * `rootMargin` считается от вьюпорта, а не от контейнера, и подгрузка внутри своего скролла
 * (см. .vac-list) срабатывает только когда сентинел уже виден — без запаса на предзагрузку.
 */
export function useInfiniteScroll(enabled: boolean, onLoadMore: () => void, root?: Element | null) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !enabled) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root, rootMargin: '200px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, onLoadMore, root]);

  return sentinelRef;
}
