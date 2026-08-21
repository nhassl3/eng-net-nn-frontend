import type { ReactNode } from 'react'

interface Props {
  count: number;
  countLabel: string;
  search: string;
  onSearch: (v: string) => void;
  searchPlaceholder: string;
  note?: ReactNode;
  action?: ReactNode;
}

export function AdminToolbar({
  count, countLabel, search, onSearch, searchPlaceholder, note, action,
}: Props) {
  return (
    <div className="admin-toolbar">
      <span className="admin-count">{count} {countLabel}</span>
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
