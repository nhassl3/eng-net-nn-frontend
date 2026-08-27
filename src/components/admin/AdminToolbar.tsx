import type { ReactNode } from 'react'

interface Props {
  count: number;
  countLabel: string;
  /** Список подгружается постранично и ещё не исчерпан — к числу дорисовываем «+» */
  hasMore?: boolean;
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder: string;
  note?: ReactNode;
  action?: ReactNode;
}

export function AdminToolbar({
  count, countLabel, hasMore, search, onSearch, searchPlaceholder, note, action,
}: Props) {
  return (
    <div className="admin-toolbar">
      {/* count — число загруженных записей: общего числа API не отдаёт. Пока есть
          что грузить, показываем «20+ вакансий»; после долистывания «+» уходит и
          число становится точным. */}
      <span className="admin-count">{count}{hasMore ? '+' : ''} {countLabel}</span>
      {note}
      <span className="spacer" />
      <input
        className="admin-search"
        type="search"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
      />
      {action}
    </div>
  );
}
