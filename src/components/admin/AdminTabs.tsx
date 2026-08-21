import { NavLink } from 'react-router-dom'

/** Источник истины — URL, поэтому активный таб в Redux не хранится. */
export function AdminTabs() {
  const cls = ({ isActive }: { isActive: boolean }) => `auth-tab${isActive ? ' active' : ''}`;

  return (
    <div className="auth-tabs admin-tabs">
      <NavLink to="/admin/vacancies" className={cls}>Вакансии</NavLink>
      <NavLink to="/admin/plans" className={cls}>Заявки КП</NavLink>
    </div>
  );
}
