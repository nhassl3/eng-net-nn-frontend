import { useEffect, useState } from 'react'
import { type RequestPlan, requestPlan } from '../../api/plan'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeQuote } from '../../store/slices/modalSlice'

// direction values are 1-based to match the DB; 0 means "not selected"
const DIRECTIONS: [string, string][] = [
  ['nvk', 'Сети НВК'],
  ['lk', 'Сети ЛК'],
  ['kn', 'Сети КН'],
  ['gas', 'Газоснабжение'],
];

const directionKeyToId = (key: string): number => DIRECTIONS.findIndex(([k]) => k === key) + 1;
const directionLabel = (id: number): string | undefined => DIRECTIONS[id - 1]?.[1];

interface FromErrors {
  full_name?: string;
  direction?: string;
  task_description?: string;
  email_to_feedback?: string;
}

export function QuoteModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.modal.quoteOpen);
  const presetDirection = useAppSelector((s) => s.modal.presetDirection);
  const [form, setForm] = useState<RequestPlan>({ full_name: '', direction: 0, task_description: '', email_to_feedback: '' });
  const [errors, setErrors] = useState<Partial<FromErrors>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open && presetDirection) {
      setForm((f) => ({ ...f, direction: directionKeyToId(presetDirection) }));
      setErrors((er) => ({ ...er, direction: undefined }));
    }
  }, [open, presetDirection]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(closeQuote()); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove('modal-open');
    };
  }, [open, dispatch]);

  if (!open) return null;

  const set = (k: keyof RequestPlan) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er: Partial<FromErrors> = {};
    if (form.full_name.trim().split(/\s+/).filter(Boolean).length < 2) er.full_name = 'Укажите имя и фамилию';
    if (form.direction <= 0) er.direction = 'Выберите направление';
    if (form.task_description.trim().length < 10) er.task_description = 'Опишите задачу подробнее (от 10 знаков)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_to_feedback)) er.email_to_feedback = 'Проверьте e‑mail';
    setErrors(er);
    if (Object.keys(er).length) return;
    await requestPlan({
        full_name: form.full_name,
        direction: form.direction,
        task_description: form.task_description,
        email_to_feedback: form.email_to_feedback,
      }).then(() => {
        setSent(true);
      }).catch((err) => {
        console.error('Error submitting plan request:', err);
      });
  };

  const close = () => {
    setSent(false);
    setForm({ full_name: '', direction: 0, task_description: '', email_to_feedback: '' });
    setErrors({});
    dispatch(closeQuote());
  };

  return (
    <div className="qm-overlay" onClick={close}>
      <div className="qm-shell" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="qm-close" onClick={close} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        {!sent ? (
          <form onSubmit={submit} className="qm-form">
            <span className="kicker"><span className="num">/ заявка</span> · IPBuilding</span>
            <h2>Запрос коммерческого предложения</h2>
            <p className="qm-lede">Расскажите про объект — пришлём смету в течение 1 рабочего дня.</p>

            <div className="field">
              <label>Имя и фамилия</label>
              <input type="text" value={form.full_name} onChange={set('full_name')} placeholder="Иван Петров" autoFocus />
              {errors.full_name && <div className="err">{errors.full_name}</div>}
            </div>

            <div className="field">
              <label>Направление</label>
              <div className="qm-chips">
                {DIRECTIONS.map(([k, l]) => (
                  <button
                    type="button"
                    key={k}
                    className={`qm-chip${form.direction === directionKeyToId(k) ? ' active' : ''}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, direction: directionKeyToId(k) }));
                      setErrors((er) => ({ ...er, direction: undefined }));
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {errors.direction && <div className="err">{errors.direction}</div>}
            </div>

            <div className="field">
              <label>Описание задачи</label>
              <textarea value={form.task_description} onChange={set('task_description')} placeholder="Объект, объёмы, сроки, особые условия" rows={4} />
              {errors.task_description && <div className="err">{errors.task_description}</div>}
            </div>

            <div className="field">
              <label>E‑mail для ответа</label>
              <input type="email" value={form.email_to_feedback} onChange={set('email_to_feedback')} placeholder="you@company.ru" />
              {errors.email_to_feedback && <div className="err">{errors.email_to_feedback}</div>}
            </div>

            <button type="submit" className="btn-submit">
              Отправить заявку <span className="arrow" />
            </button>
          </form>
        ) : (
          <div className="qm-success">
            <div className="check">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Заявка принята</h2>
            <p>
              Спасибо, {form.full_name.split(/\s+/)[0]}. Инженер по направлению «{directionLabel(form.direction)}» подготовит КП
              и пришлёт на <strong>{form.email_to_feedback}</strong> в течение рабочего дня.
            </p>
            <button onClick={close} className="btn btn-primary" style={{ marginTop: 24 }}>
              Готово
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
