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
import { useInfiniteScroll } from '../useInfiniteScroll'
import { VacancyJdRow } from './VacancyJdRow'

export function VacanciesJdTab() {
	const dispatch = useAppDispatch();
	const { vacanciesJd } = useAdminData();
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return vacanciesJd.items;
		return vacanciesJd.items.filter((v) =>
			v.jd_description.toLowerCase().includes(q) ||
			v.jd_name?.toLowerCase().includes(q) ||
			v.jd_tags?.some((t) => t.toLowerCase().includes(q))
		);
	}, [vacanciesJd.items, search]);

	// Во время поиска не подгружаем: фильтр всё равно смотрит только на уже загруженное
	const sentinelRef = useInfiniteScroll(
		!search && vacanciesJd.hasMore && !vacanciesJd.loadingMore,
		vacanciesJd.loadMore,
	);

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
				count={vacanciesJd.items.length}
				countLabel="профилей вакансий"
				hasMore={vacanciesJd.hasMore}
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

			{vacanciesJd.status === 'loading' && <AdminLoading label="Загружаем профили вакансий…" />}

			{vacanciesJd.status === 'error' && (
				<AdminError message={vacanciesJd.error ?? 'Не удалось загрузить профили вакансий'} onRetry={vacanciesJd.reload} />
			)}

			{vacanciesJd.status === 'success' && filtered.length === 0 && (
				<AdminEmpty
					title={search ? 'Ничего не найдено' : 'Профилей вакансий пока нет'}
					description={search
						? 'Попробуйте изменить запрос.'
						: 'Создайте первый профиль — он появится в этом списке.'}
					action={search ? undefined : createBtn}
				/>
			)}

			{vacanciesJd.status === 'success' && filtered.length > 0 && (
				<>
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

					{!search && vacanciesJd.hasMore && (
						<div ref={sentinelRef} className="admin-load-more">
							{vacanciesJd.loadingMore
								? <AdminLoading label="Загружаем ещё…" />
								: (
									<button type="button" className="btn btn-ghost" onClick={vacanciesJd.loadMore}>
										Загрузить ещё
									</button>
								)}
						</div>
					)}

					{search && vacanciesJd.hasMore && (
						<p className="admin-load-more admin-hint">
							Поиск идёт по загруженным записям ({vacanciesJd.items.length}).
							Очистите запрос и прокрутите список, чтобы загрузить остальные.
						</p>
					)}
				</>
			)}
		</>
	);
}
