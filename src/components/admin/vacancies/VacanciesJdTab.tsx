import { useMemo, useState } from 'react'
import { useAppDispatch } from '../../../store/hooks'
import {
	openVacancyJdCreate,
	openVacancyJdDelete, openVacancyJdEdit,
	openVacancyJdView,
} from '../../../store/slices/adminSlice'
import { AdminEmpty, AdminError, AdminLoading } from '../AdminState'
import { AdminToolbar } from '../AdminToolbar'
import { useAdminData } from '../adminData'
import { VacancyJdRow } from './VacancyJdRow'

export function VacanciesJdTab() {
	const dispatch = useAppDispatch();
	const { vacanciesJd } = useAdminData();
	const [search, setSearch] = useState('');

	const list = useMemo(() => vacanciesJd.data ?? [], [vacanciesJd.data]);

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return list;
		return list.filter((v) =>
			v.jd_description.toLowerCase().includes(q) ||
			v.jd_name?.toLowerCase().includes(q) ||
			v.jd_tags?.some((t) => t.toLowerCase().includes(q))
		);
	}, [list, search]);

	const createBtn = (
		<>
			<button type="button" className="btn btn-primary" onClick={() => dispatch(openVacancyJdCreate())}>
				Создать профиль для вакансии <span className="arrow" />
			</button>
		</>
	);

	return (
		<>
			<AdminToolbar
				count={list.length}
				countLabel="профилей вакансий"
				search={search}
				onSearch={setSearch}
				searchPlaceholder="Поиск по названию или тегу"
				note={
					<span className="admin-badge muted" title="Публичная страница /vacancies пока использует статический список из src/data/vacancies.ts">
						данные API
					</span>
				}
				action={createBtn}
			/>

			{vacanciesJd.status === 'loading' && <AdminLoading label="Загружаем вакансии…" />}

			{vacanciesJd.status === 'error' && (
				<AdminError message={vacanciesJd.error ?? 'Не удалось загрузить вакансии'} onRetry={vacanciesJd.reload} />
			)}

			{vacanciesJd.status === 'success' && filtered.length === 0 && (
				<AdminEmpty
					title={search ? 'Ничего не найдено' : 'Вакансий пока нет'}
					description={search
						? 'Попробуйте изменить запрос.'
						: 'Создайте первую вакансию — она появится в этом списке.'}
					action={search ? undefined : createBtn}
				/>
			)}

			{vacanciesJd.status === 'success' && filtered.length > 0 && (
				<div className="admin-list">
					{filtered.map((item) => (
						<VacancyJdRow
							key={item.id}
							item={item}
							onView={() => dispatch(openVacancyJdView(item.id))}
							onEdit={() => dispatch(openVacancyJdEdit(item.id))}
							onDelete={() => dispatch(openVacancyJdDelete(item.id))}
						/>
					))}
				</div>
			)}
		</>
	);
}
