import { useEffect, useState } from 'react'
import { useAsyncAction } from '../../hooks/useAsync'
import { AdminModalShell } from './AdminModalShell'

interface Props {
  open: boolean;
  onClose: () => void;
  kicker: string;
  title: string;
  /** Кому уходит письмо — показываем, чтобы админ не ошибся адресатом */
  recipient: string;
  defaultSubject: string;
  send: (subject: string, message: string) => Promise<unknown>;
  stacked?: boolean;
}

/**
 * Общая форма ответа (кандидату и заявителю КП).
 *
 * Отправка сейчас замокана — бейдж «демо-режим» стоит намеренно, чтобы никто
 * не решил, что письмо действительно ушло. Убрать вместе с заглушками в api/.
 */
export function ReplyModal({
  open, onClose, kicker, title, recipient, defaultSubject, send, stacked,
}: Props) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const action = useAsyncAction(send);

  useEffect(() => {
    if (!open) return;
    setSubject(defaultSubject);
    setMessage('');
    setError(null);
    setDone(false);
    action.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultSubject]);

  const pending = action.status === 'loading';

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError('Сообщение от 10 символов');
      return;
    }
    setError(null);
    const res = await action.run(subject.trim(), message.trim());
    if (res === undefined) return; // ошибка в action.error, текст сохранён
    setDone(true);
    setTimeout(onClose, 1400);
  };

  return (
    <AdminModalShell
      open={open}
      onClose={pending ? () => {} : onClose}
      kicker={kicker}
      title={title}
      lede={<>Ответ уйдёт на <strong>{recipient}</strong></>}
      stacked={stacked}
      scroll
    >
      {done ? (
        <div className="qm-success">
          <div className="check">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Ответ отправлен</h2>
          <p>Демо-режим: письмо на самом деле не отправлено.</p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <p>
            <span className="admin-badge muted">демо-режим · письмо не отправляется</span>
          </p>

          {(error ?? action.error) && <p className="auth-error">{error ?? action.error}</p>}

          <div className="field">
            <label htmlFor="reply-subject">Тема</label>
            <input
              id="reply-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Тема письма"
            />
          </div>

          <div className="field">
            <label htmlFor="reply-message">Сообщение</label>
            <textarea
              id="reply-message"
              rows={7}
              value={message}
              onChange={(e) => { setMessage(e.target.value); setError(null); }}
              placeholder="Текст ответа"
              autoFocus
            />
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={pending}>
              Отмена
            </button>
            <button type="submit" className="btn-submit" disabled={pending}>
              {pending && <span className="auth-spinner" />}
              {pending ? 'Отправляем…' : 'Отправить'}
            </button>
          </div>
        </form>
      )}
    </AdminModalShell>
  );
}
