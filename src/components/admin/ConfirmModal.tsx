import { type ReactNode } from 'react'
import { AdminModalShell } from './AdminModalShell'

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  kicker: string;
  title: string;
  lede?: ReactNode;
  confirmLabel: string;
  pending: boolean;
  error: string | null;
  children?: ReactNode;
}

export function ConfirmModal({
  open, onClose, onConfirm, kicker, title, lede, confirmLabel, pending, error, children,
}: Props) {
  return (
    <AdminModalShell open={open} onClose={onClose} kicker={kicker} title={title} lede={lede}>
      {error && <p className="auth-error">{error}</p>}
      {children}
      <div className="admin-modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={pending}>
          Отмена
        </button>
        <button
          type="button"
          className="btn-submit btn-danger"
          onClick={onConfirm}
          disabled={pending}
        >
          {pending && <span className="auth-spinner" />}
          {pending ? 'Удаляем…' : confirmLabel}
        </button>
      </div>
    </AdminModalShell>
  );
}
