import type { ReactNode } from 'react'

export function AdminLoading({ label = 'Загружаем…' }: { label?: string }) {
  return (
    <div className="admin-loading">
      <span className="auth-spinner" />
      {label}
    </div>
  );
}

export function AdminError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="admin-error-box">
      <p>{message}</p>
      <button type="button" className="btn btn-ghost" onClick={onRetry}>
        Повторить
      </button>
    </div>
  );
}

export function AdminEmpty({ title, description, action }: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-empty">
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
