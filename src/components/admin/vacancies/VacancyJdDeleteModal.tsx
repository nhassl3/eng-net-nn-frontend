import { useEffect } from 'react'
import { deleteVacancyJd } from '../../../api/vacancy'
import { useAsyncAction } from '../../../hooks/useAsync'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeVacancyJdDelete, refreshAdminLists } from '../../../store/slices/adminSlice'
import type { VacancyJd } from '../../../types/domain'
import { ConfirmModal } from '../ConfirmModal'

export function VacancyJdDeleteModal({ vacancies }: { vacancies: VacancyJd[] }) {
	const dispatch = useAppDispatch();
	const id = useAppSelector((s) => s.admin.vacancyJdDeleteId);
	const vacancy = id === null ? undefined : vacancies.find((v) => v.id === id);

	const remove = useAsyncAction(async (jdId: number) => {
		await deleteVacancyJd(jdId);
		return true as const;
	});

	useEffect(() => { if (id !== null) remove.reset(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

	const close = () => dispatch(closeVacancyJdDelete());

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
			title="Удалить профиль вакансии?"
			lede={
				<>
					Профиль <strong>«{vacancy?.jd_name ?? '—'}»</strong> будет удалён безвозвратно.
					Вакансии, использующие этот профиль, могут перестать отображаться корректно.
				</>
			}
			confirmLabel="Удалить"
			pending={remove.status === 'loading'}
			error={remove.error}
		/>
	);
}
