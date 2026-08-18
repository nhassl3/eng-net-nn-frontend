import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { closeQuote } from '../../store/slices/modalSlice'

interface FormData {
  name: string;
  direction: string;
  desc: string;
  email: string;
}

const DIRECTIONS: [string, string][] = [
  ['nvk', 'Сети НВК'],
  ['lk', 'Сети ЛК'],
  ['kn', 'Сети КН'],
  ['gas', 'Газоснабжение'],
];

const DIRECTION_LABELS: Record<string, string> = {
  nvk: 'Сети НВК', lk: 'Сети ЛК', kn: 'Сети КН', gas: 'Газоснабжение',
};

export function QuoteModal() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.modal.quoteOpen);
  const presetDirection = useAppSelector((s) => s.modal.presetDirection);
  const [form, setForm] = useState<FormData>({ name: '', direction: '', desc: '', email: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open && presetDirection) {
      setForm((f) => ({ ...f, direction: presetDirection }));
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

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er: Partial<FormData> = {};
    if (form.name.trim().split(/\s+/).filter(Boolean).length < 2) er.name = 'Укажите имя и фамилию';
    if (!form.direction) er.direction = 'Выберите направление';
    if (form.desc.trim().length < 10) er.desc = 'Опишите задачу подробнее (от 10 знаков)';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = 'Проверьте e‑mail';
    setErrors(er);
    if (Object.keys(er).length) return;
    setSent(true);
  };

  const close = () => {
    setSent(false);
    setForm({ name: '', direction: '', desc: '', email: '' });
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
              <input type="text" value={form.name} onChange={set('name')} placeholder="Иван Петров" autoFocus />
              {errors.name && <div className="err">{errors.name}</div>}
            </div>

            <div className="field">
              <label>Направление</label>
              <div className="qm-chips">
                {DIRECTIONS.map(([k, l]) => (
                  <button
                    type="button"
                    key={k}
                    className={`qm-chip${form.direction === k ? ' active' : ''}`}
                    onClick={() => {
                      setForm((f) => ({ ...f, direction: k }));
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
              <textarea value={form.desc} onChange={set('desc')} placeholder="Объект, объёмы, сроки, особые условия" rows={4} />
              {errors.desc && <div className="err">{errors.desc}</div>}
            </div>

            <div className="field">
              <label>E‑mail для ответа</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@company.ru" />
              {errors.email && <div className="err">{errors.email}</div>}
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
              Спасибо, {form.name.split(/\s+/)[0]}. Инженер по направлению «{DIRECTION_LABELS[form.direction]}» подготовит КП
              и пришлёт на <strong>{form.email}</strong> в течение рабочего дня.
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
