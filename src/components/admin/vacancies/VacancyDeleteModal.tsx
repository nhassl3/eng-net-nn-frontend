import { useEffect } from 'react'
import { deleteVacancy } from '../../../api/vacancy'
import { useAsyncAction } from '../../../hooks/useAsync'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeVacancyDelete, refreshAdminLists } from '../../../store/slices/adminSlice'
import type { VacancyWithJd } from '../../../types/domain'
import { ConfirmModal } from '../ConfirmModal'

export function VacancyDeleteModal({ vacancies }: { vacancies: VacancyWithJd[] }) {
  const dispatch = useAppDispatch();
  const id = useAppSelector((s) => s.admin.vacancyDeleteId);
  const vacancy = id === null ? undefined : vacancies.find((v) => v.uuid === id);

  // Возвращаем true, чтобы отличить успех от ошибки: run() резолвится в
  // undefined при ошибке, а deleteVacancy сама по себе Promise<void>
  const remove = useAsyncAction(async (uuid: string) => {
    await deleteVacancy(uuid);
    return true as const;
  });

  useEffect(() => { if (id !== null) remove.reset(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => dispatch(closeVacancyDelete());

  const confirm = async () => {
    if (id === null) return;
    const ok = await remove.run(id);
    if (!ok) return; // ошибка показана в модалке, окно не закрываем
    dispatch(refreshAdminLists());
    close();
  };

  return (
    <ConfirmModal
      open={id !== null}
      onClose={close}
      onConfirm={confirm}
      kicker="удаление"
      title="Удалить вакансию?"
      lede={
        <>
          Вакансия <strong>«{vacancy?.name ?? '—'}»</strong> будет удалена безвозвратно.
          Отклики на неё останутся в базе, но потеряют связь с вакансией.
        </>
      }
      confirmLabel="Удалить"
      pending={remove.status === 'loading'}
      error={remove.error}
    />
  );
}
