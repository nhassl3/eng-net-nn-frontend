import { useEffect, useState } from 'react'
import { createVacancy, updateVacancy } from '../../../api/vacancy'
import { useAsyncAction } from '../../../hooks/useAsync'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import {
  closeVacancyCreate, closeVacancyEdit, refreshAdminLists,
} from '../../../store/slices/adminSlice'
import type { VacancyWithJd } from '../../../types/domain'
import { AdminModalShell } from '../AdminModalShell'

interface FormState {
  name: string;
  description: string;
  required_exp: string;
  pay_day: string;
  skills: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  pay_day?: string;
}

const EMPTY: FormState = { name: '', description: '', required_exp: '', pay_day: '', skills: '' };

const toForm = (v: VacancyWithJd): FormState => ({
  name: v.name,
  description: v.description,
  required_exp: v.required_exp ?? '',
  pay_day: String(v.pay_day ?? 0),
  skills: (v.skills ?? []).join(', '),
});

const parseSkills = (raw: string): string[] =>
  raw.split(',').map((s) => s.trim()).filter(Boolean);

function validate(form: FormState): FormErrors {
  const er: FormErrors = {};
  if (form.name.trim().length < 3) er.name = 'Название от 3 символов';
  if (form.description.trim().length < 20) er.description = 'Описание от 20 символов';

  const pay = Number(form.pay_day);
  if (form.pay_day !== '' && (!Number.isFinite(pay) || pay < 0)) {
    er.pay_day = 'Зарплата — положительное число';
  }
  return er;
}

/** Одна модалка на создание и редактирование — формы идентичны. */
export function VacancyFormModal({ vacancies }: { vacancies: VacancyWithJd[] }) {
  const dispatch = useAppDispatch();
  const createOpen = useAppSelector((s) => s.admin.vacancyCreateOpen);
  const editId = useAppSelector((s) => s.admin.vacancyEditId);

  const isEdit = editId !== null;
  const open = createOpen || isEdit;

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [done, setDone] = useState(false);

  const save = useAsyncAction(async (state: FormState) => {
    const payload = {
      name: state.name.trim(),
      description: state.description.trim(),
      required_exp: state.required_exp.trim(),
      pay_day: Number(state.pay_day) || 0,
      skills: parseSkills(state.skills),
    };
    return isEdit
      // TODO(backend): уточнить назначение поля 'jd' — в Vacancy его нет
      ? updateVacancy(editId, payload)
      : createVacancy({ ...payload, jd: 0 });
  });

  // Сид формы при открытии: из уже загруженного списка, без лишнего запроса
  useEffect(() => {
    if (!open) return;
    const source = isEdit ? vacancies.find((v) => v.uuid === editId) : undefined;
    setForm(source ? toForm(source) : EMPTY);
    setErrors({});
    setDone(false);
    save.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editId]);

  const close = () => {
    dispatch(isEdit ? closeVacancyEdit() : closeVacancyCreate());
  };

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const er = validate(form);
    setErrors(er);
    if (Object.keys(er).length) return;

    const res = await save.run(form);
    if (!res) return; // ошибка уже в save.error, форма сохранена

    setDone(true);
    dispatch(refreshAdminLists());
    setTimeout(close, 1200);
  };

  const pending = save.status === 'loading';

  return (
    <AdminModalShell
      open={open}
      onClose={pending ? () => {} : close}
      kicker={isEdit ? 'редактирование' : 'новая вакансия'}
      title={isEdit ? 'Изменить вакансию' : 'Создать вакансию'}
      lede={isEdit ? undefined : 'Заполните карточку — вакансия появится в списке сразу после сохранения.'}
      scroll
    >
      {done ? (
        <div className="qm-success">
          <div className="check">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2>{isEdit ? 'Изменения сохранены' : 'Вакансия создана'}</h2>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          {save.error && <p className="auth-error">{save.error}</p>}

          <div className="field">
            <label htmlFor="vac-name">Название</label>
            <input
              id="vac-name"
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Ведущий инженер-проектировщик"
              autoFocus
            />
            {errors.name && <div className="err">{errors.name}</div>}
          </div>

          <div className="form-grid">
            <div className="field">
              <label htmlFor="vac-pay">Зарплата, ₽</label>
              <input
                id="vac-pay"
                type="number"
                min="0"
                value={form.pay_day}
                onChange={set('pay_day')}
                placeholder="180000"
              />
              {errors.pay_day && <div className="err">{errors.pay_day}</div>}
            </div>

            <div className="field">
              <label htmlFor="vac-exp">Требуемый опыт</label>
              <input
                id="vac-exp"
                type="text"
                value={form.required_exp}
                onChange={set('required_exp')}
                placeholder="от 5 лет"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="vac-desc">Описание</label>
            <textarea
              id="vac-desc"
              rows={5}
              value={form.description}
              onChange={set('description')}
              placeholder="Задачи, проекты, условия работы"
            />
            {errors.description && <div className="err">{errors.description}</div>}
          </div>

          <div className="field">
            <label htmlFor="vac-skills">Навыки</label>
            <input
              id="vac-skills"
              type="text"
              value={form.skills}
              onChange={set('skills')}
              placeholder="AutoCAD, Revit, СП 30"
            />
            <p className="auth-hint">Через запятую</p>
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost" onClick={close} disabled={pending}>
              Отмена
            </button>
            <button type="submit" className="btn-submit" disabled={pending}>
              {pending && <span className="auth-spinner" />}
              {pending ? 'Сохраняем…' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      )}
    </AdminModalShell>
  );
}
