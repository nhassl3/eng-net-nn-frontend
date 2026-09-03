import { useEffect, useState } from 'react'
import { MAX_RESUME_SIZE, RESUME_EXTENSIONS, respond } from '../../api/vacancy'
import type { RespondInput } from '../../api/vacancy'
import { useAsyncAction } from '../../hooks/useAsync'
import { useAppSelector } from '../../store/hooks'
import type { VacancyWithJd } from '../../types/domain'

interface FormData {
  name: string;
  phone: string;
  email: string;
  city: string;
  exp: string;
  message: string;
  file: File | null;
  consent: boolean;
}

interface VacancyFormProps {
  vacancies: VacancyWithJd[];
  loading: boolean;
}

export function VacancyForm({ vacancies, loading }: VacancyFormProps) {
  const activeId = useAppSelector((s) => s.vacancy.activeId);
  const vacancy = vacancies.find((v) => v.uuid === activeId);

  const [data, setData] = useState<FormData>({
    name: '', phone: '', email: '', city: '', exp: '', message: '', file: null, consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [sent, setSent] = useState(false);

  const send = useAsyncAction((input: RespondInput, resume: File) => respond(input, resume));

  // Переключение вакансии сбрасывает экран успеха и состояние прошлой отправки — иначе успех
  // с одной вакансии продолжает висеть при переходе на другую.
  useEffect(() => {
    setSent(false);
    send.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox'
      ? target.checked
      : target.type === 'file'
        ? (target.files?.[0] ?? null)
        : e.target.value;
    setData((d) => ({ ...d, [k]: value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vacancy) return;
    const er: Partial<Record<keyof FormData, string>> = {};
    if (data.name.trim().length < 2) er.name = 'Укажите имя';
    if (!/^[+\d][\d\s\-()]{8,}$/.test(data.phone)) er.phone = 'Проверьте телефон';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) er.email = 'Проверьте e‑mail';
    if (!data.file) er.file = 'Прикрепите резюме';
    else if (data.file.size > MAX_RESUME_SIZE) er.file = 'Файл больше 10 МБ';
    else if (!RESUME_EXTENSIONS.some((ext) => data.file!.name.toLowerCase().endsWith(ext))) {
      er.file = 'Формат не поддерживается: PDF, DOC, DOCX, TXT, RTF';
    }
    if (!data.consent) er.consent = 'Нужно согласие';
    if (Object.keys(er).length) { setErrors(er); return; }

    const res = await send.run({
      vacancy_id: vacancy.uuid,
      fullName: data.name,
      phoneNumber: data.phone,
      email: data.email,
      city: data.city,
      exp: data.exp,
      description: data.message,
    }, data.file!);
    if (!res) return; // ошибка уже в send.error

    setSent(true);
  };

  const pending = send.status === 'loading';

  // Пока список ещё грузится, карточку не убираем — иначе сетка .vac-grid прыгает при каждой
  // подгрузке страницы. null оставляем только для случая, когда список реально пуст.
  if (!vacancy) {
    if (loading) {
      return (
        <div className="form-card" aria-busy="true">
          <span className="kicker"><span className="num">/ заявка</span></span>
          <h2>Загружаем вакансию…</h2>
        </div>
      );
    }
    return null;
  }

  if (sent) {
    return (
      <div className="form-card">
        <div className="vac-success">
          <div className="check">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>Заявка отправлена</h2>
          <p style={{ color: 'var(--fg-soft)', fontSize: 14, marginTop: 4 }}>
            Спасибо, {data.name}. HR‑менеджер свяжется с вами по номеру <strong>{data.phone}</strong> в течение 1 рабочего дня.
            Если телефон не возьмёт — продублируем письмом на {data.email}.
          </p>
          <button
            onClick={() => {
              setSent(false);
              send.reset();
              setData({ name: '', phone: '', email: '', city: '', exp: '', message: '', file: null, consent: false });
            }}
            className="btn btn-ghost"
            style={{ marginTop: 24 }}
          >
            Отправить ещё одну
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <span className="kicker"><span className="num">/ заявка</span></span>
      <h2>Откликнуться: {vacancy.name}</h2>
      <p className="lede">Заполните форму — резюме можно прикрепить файлом или прислать ссылку в комментарии.</p>

      {send.error && <p className="auth-error">{send.error}</p>}

      <div className="form-grid">
        <div className="field full">
          <label>Имя и фамилия</label>
          <input type="text" value={data.name} onChange={set('name')} placeholder="Иван Петров" />
          {errors.name && <div className="err">{errors.name}</div>}
        </div>
        <div className="field">
          <label>Телефон</label>
          <input type="tel" value={data.phone} onChange={set('phone')} placeholder="+7 (___) ___‑__‑__" />
          {errors.phone && <div className="err">{errors.phone}</div>}
        </div>
        <div className="field">
          <label>E‑mail</label>
          <input type="email" value={data.email} onChange={set('email')} placeholder="you@mail.ru" />
          {errors.email && <div className="err">{errors.email}</div>}
        </div>
        <div className="field">
          <label>Город</label>
          <input type="text" value={data.city} onChange={set('city')} placeholder="Нижний Новгород" />
        </div>
        <div className="field">
          <label>Опыт по профилю</label>
          <select value={data.exp} onChange={set('exp')}>
            <option value="">— не выбрано —</option>
            <option>До 1 года</option>
            <option>1–3 года</option>
            <option>3–5 лет</option>
            <option>5–10 лет</option>
            <option>10+ лет</option>
          </select>
        </div>
        <div className="field full">
          <label>Комментарий или ссылка на резюме</label>
          <textarea value={data.message} onChange={set('message')} placeholder="Расскажите кратко о проектах, на которых работали" />
        </div>
        <div className="field full">
          <label>Резюме (PDF / DOC / DOCX / TXT / RTF)</label>
          <label className="upload">
            <span>{data.file ? data.file.name : 'Перетащите файл сюда или нажмите'}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
              {data.file ? `${Math.round(data.file.size / 1024)} КБ` : 'до 10 МБ'}
            </span>
            <input type="file" accept={RESUME_EXTENSIONS.join(',')} onChange={set('file')} style={{ display: 'none' }} />
          </label>
          {errors.file && <div className="err">{errors.file}</div>}
        </div>
        <div className="full">
          <label className="consent">
            <input type="checkbox" checked={data.consent} onChange={set('consent')} />
            <span>
              Согласен на обработку персональных данных в соответствии с{' '}
              <a href="#" style={{ textDecoration: 'underline' }}>политикой конфиденциальности</a>.
            </span>
          </label>
          {errors.consent && <div className="err" style={{ marginTop: 4 }}>{errors.consent}</div>}
        </div>
        <div className="full" style={{ marginTop: 8 }}>
          <button type="submit" className="btn-submit" disabled={!data.consent || pending}>
            {pending ? <><span className="auth-spinner" /> Отправляем…</> : <>Отправить заявку <span className="arrow" /></>}
          </button>
        </div>
      </div>
    </form>
  );
}
