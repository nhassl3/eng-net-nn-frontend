import { useCallback, useEffect, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { getAllPlans } from '../api/plan'
import { ADMIN_PAGE_SIZE, getAllVacancies, getAllVacanciesJd, getVacancyResponses } from '../api/vacancy'
import { AdminTabs } from '../components/admin/AdminTabs'
import type { AdminData } from '../components/admin/adminData'
import { PlanReplyModal } from '../components/admin/plans/PlanReplyModal'
import { PlanViewModal } from '../components/admin/plans/PlanViewModal'
import { RespondReplyModal } from '../components/admin/vacancies/RespondReplyModal'
import { RespondsModal } from '../components/admin/vacancies/RespondsModal'
import { VacancyDeleteModal } from '../components/admin/vacancies/VacancyDeleteModal'
import { VacancyFormModal } from '../components/admin/vacancies/VacancyFormModal'
import { VacancyJdDeleteModal } from '../components/admin/vacancies/VacancyJdDeleteModal'
import { VacancyJdFormModal } from '../components/admin/vacancies/VacancyJdFormModal'
import { VacancyJdViewModal } from '../components/admin/vacancies/VacancyJdViewModal'
import { VacancyViewModal } from '../components/admin/vacancies/VacancyViewModal'
import { Footer } from '../components/layout/Footer'
import { Nav } from '../components/layout/Nav'
import { useApiResource, usePaginatedList } from '../hooks/useAsync'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { resetAdmin } from '../store/slices/adminSlice'
import type { VacancyJd, VacancyWithJd } from '../types/domain'

// Ключи для склейки страниц без дублей — вынесены наружу, чтобы не пересоздавались
const vacancyKey = (v: VacancyWithJd) => v.uuid;
const vacancyJdKey = (jd: VacancyJd) => jd.id;

export function AdminPage() {
	const dispatch = useAppDispatch();
	const refreshToken = useAppSelector((s) => s.admin.listRefreshToken);
	const admin = useAppSelector((s) => s.admin);

	// Списки грузим здесь, а не в табах: модалки вынесены на этот уровень,
	// но им нужны те же данные. Побочный плюс — переключение табов без перезапроса.
	const responds = useApiResource(getVacancyResponses, [refreshToken]);
	const plans = useApiResource(getAllPlans, [refreshToken]);

	// Вакансии и профили работ — постранично: таб доскроллил до конца → следующая страница.
	// Модалки ищут запись в этих же items, поэтому списки обязаны быть общими.
	const fetchVacanciesPage = useCallback(
		({ limit, offset }: { limit: number; offset: number }) =>
			getAllVacancies({ limit, offset }).then((res) => ({ items: res.vacancies })),
		[],
	);
	const vacancies = usePaginatedList(fetchVacanciesPage, ADMIN_PAGE_SIZE, [refreshToken], vacancyKey);

	const fetchVacanciesJdPage = useCallback(
		({ limit, offset }: { limit: number; offset: number }) =>
			getAllVacanciesJd({ limit, offset }).then((res) => ({ items: res.job_directions })),
		[],
	);
	const vacanciesJd = usePaginatedList(fetchVacanciesJdPage, ADMIN_PAGE_SIZE, [refreshToken], vacancyJdKey);

	const vacancyJdList = vacanciesJd.items;
	const vacancyList = vacancies.items;
	const respondList = useMemo(() => responds.data?.respond_vacancies ?? [], [responds.data]);
	const planList = useMemo(() => plans.data?.plans ?? [], [plans.data]);

	const outlet: AdminData = { vacancies, vacanciesJd, responds, plans };

	const anyModalOpen =
		admin.vacancyCreateOpen ||
		admin.vacancyViewId !== null ||
		admin.vacancyEditId !== null ||
		admin.vacancyDeleteId !== null ||
		admin.vacancyJdCreateOpen ||
		admin.vacancyJdViewId !== null ||
		admin.vacancyJdEditId !== null ||
		admin.vacancyJdDeleteId !== null ||
		admin.respondsVacancyId !== null ||
		admin.respondReplyId !== null ||
		admin.planViewId !== null ||
		admin.planReplyId !== null;

	useEffect(() => {
		document.documentElement.setAttribute('data-style', 'b');
		requestAnimationFrame(() => document.body.classList.add('loaded'));
		return () => { document.body.classList.remove('loaded'); };
	}, []);

	// Чтобы при повторном входе не открылась модалка, оставшаяся с прошлого раза
	useEffect(() => () => { dispatch(resetAdmin()); }, [dispatch]);

	return (
		<>
			<div className={`app-shell${anyModalOpen ? ' app-blur' : ''}`}>
				<Nav />
				<main>
					<section className="section-pad-sm" style={{ paddingTop: 0 }}>
						<div className="container">
							<header className="admin-head">
								<span className="kicker"><span className="num">/ управление</span> · IPBuilding</span>
								<h1>Админ-панель</h1>
								<p className="lede">
									Управление вакансиями, их профилями и обработка заявок на коммерческое предложение.
								</p>
								<AdminTabs />
							</header>

							<Outlet context={outlet} />
						</div>
					</section>
				</main>
				<Footer />
			</div>

			{/* Соседи .app-shell, а не потомки — иначе blur лёг бы и на них */}
			<VacancyJdFormModal vacancies={vacancyJdList} />
			<VacancyJdViewModal vacancies={vacancyJdList} />
			<VacancyJdDeleteModal vacancies={vacancyJdList} />
			<VacancyViewModal vacancies={vacancyList} />
			<VacancyFormModal vacancies={vacancyList} vacanciesJd={vacancyJdList} />
			<VacancyDeleteModal vacancies={vacancyList} />
			<RespondsModal vacancies={vacancyList} responds={respondList} state={responds} />
			<RespondReplyModal responds={respondList} />
			<PlanViewModal plans={planList} />
			<PlanReplyModal plans={planList} />
		</>
	);
}
