import { useState } from 'react'
import { assignRole, searchUserByUsername, type AssignableRole } from '../../../api/users'
import { useAsyncAction } from '../../../hooks/useAsync'
import type { User } from '../../../types/domain'

const ROLES: [AssignableRole, string][] = [
  ['admin', 'Администратор'],
  ['partner', 'Партнёр'],
];

const ROLE_LABEL: Record<string, string> = {
  admin: 'Администратор',
  partner: 'Партнёр',
  user: 'Пользователь',
};

export function UsersTab() {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<AssignableRole>('admin');
  const [found, setFound] = useState<User | null>(null);

  const search = useAsyncAction(searchUserByUsername);
  const assign = useAsyncAction(assignRole);

  const submitSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = username.trim();
    if (q.length < 3) return;
    assign.reset();
    const user = await search.run(q);
    setFound(user ?? null);
  };

  const confirmAssign = async () => {
    if (!found) return;
    const res = await assign.run(found.uuid, role);
    if (res === undefined) return;
    setFound((u) => (u ? { ...u, role } : u));
  };

  const searching = search.status === 'loading';
  const assigning = assign.status === 'loading';

  return (
    <>
      <form className="admin-toolbar" onSubmit={submitSearch}>
        <input
          className="admin-search"
          type="search"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setFound(null); assign.reset(); }}
          placeholder="Поиск пользователя по username"
          aria-label="Поиск пользователя по username"
          minLength={3}
          maxLength={30}
        />
        <span className="spacer" />
        <button type="submit" className="btn btn-primary" disabled={searching || username.trim().length < 3}>
          {searching && <span className="auth-spinner" />}
          {searching ? 'Ищем…' : 'Найти'}
        </button>
      </form>

      {search.status === 'error' && <p className="auth-error">{search.error}</p>}

      {found && (
        <div className="admin-row">
          <div className="admin-row-main">
            <h3>{found.full_name || found.username}</h3>
            <div className="admin-row-meta">
              <span>@{found.username}</span>
              <span>{found.email}</span>
              <span className="admin-badge accent">{ROLE_LABEL[found.role] ?? found.role}</span>
            </div>
          </div>

          <div className="field" style={{ minWidth: 200 }}>
            <label htmlFor="assign-role">Назначить роль</label>
            <select id="assign-role" value={role} onChange={(e) => setRole(e.target.value as AssignableRole)}>
              {ROLES.map(([k, l]) => (
                <option key={k} value={k}>{l}</option>
              ))}
            </select>
          </div>

          <button type="button" className="btn-submit" onClick={confirmAssign} disabled={assigning}>
            {assigning && <span className="auth-spinner" />}
            {assigning ? 'Назначаем…' : 'Назначить'}
          </button>

          {assign.status === 'error' && <p className="auth-error">{assign.error}</p>}
          {assign.status === 'success' && <p className="admin-badge accent">Роль назначена</p>}
        </div>
      )}
    </>
  );
}
