/** Направления заявок КП — 1-based, как в БД (0 = не выбрано). См. QuoteModal. */
export const PLAN_DIRECTIONS = ['Сети НВК', 'Сети ЛК', 'Сети КН', 'Газоснабжение'];

export const planDirectionLabel = (id: number): string =>
  PLAN_DIRECTIONS[id - 1] ?? 'Не указано';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatMoney(v: number): string {
  if (!v) return 'не указана';
  return `${v.toLocaleString('ru-RU')} ₽`;
}

/** required_exp — свободный текст («от 5 лет», «без опыта»), не число */
export function formatExp(exp: string): string {
  return exp?.trim() ? exp.trim() : 'не указан';
}
