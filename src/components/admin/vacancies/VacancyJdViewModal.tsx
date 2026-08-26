import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { closeVacancyJdView, openVacancyJdEdit } from '../../../store/slices/adminSlice'
import type { VacancyJd } from '../../../types/domain'
import { AdminModalShell } from '../AdminModalShell'

export function VacancyJdViewModal({ vacancies }: { vacancies: VacancyJd[] }) {
	const dispatch = useAppDispatch();
	const id = useAppSelector((s) => s.admin.vacancyJdViewId);
	const vacancy = id === null ? undefined : vacancies.find((v) => v.id === id);

	const close = () => dispatch(closeVacancyJdView());

	return (
		<AdminModalShell
			open={id !== null}
			onClose={close}
			kicker="профиль вакансии"
			title={vacancy?.jd_name ?? 'Профиль не найден'}
			scroll
		>
			{!vacancy ? (
				<p className="qm-lede">Запись могла быть удалена. Обновите список.</p>
			) : (
				<>
					<dl className="admin-kv">
						<dt>Описание</dt>
						<dd className="long">{vacancy.jd_description || '—'}</dd>
					</dl>

					{vacancy.jd_tags?.length > 0 && (
						<div className="field">
							<label>Теги</label>
							<div className="qm-chips">
								{vacancy.jd_tags.map((t) => (
									<span key={t} className="qm-chip">{t}</span>
								))}
							</div>
						</div>
					)}

					<div className="admin-modal-actions">
						<button type="button" className="btn btn-ghost" onClick={close}>Закрыть</button>
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => { close(); dispatch(openVacancyJdEdit(vacancy.id)); }}
						>
							Изменить <span className="arrow" />
						</button>
					</div>
				</>
			)}
		</AdminModalShell>
	);
}
