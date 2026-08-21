import type React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Nav } from '../layout/Nav'
import { AccessDeniedPage } from '../../pages/AccessDeniedPage'

/**
 * Защита админ-маршрутов. Рендерит 403 НА МЕСТЕ, без редиректа — адрес
 * /admin/... остаётся в строке браузера.
 *
 * Это UX, а не безопасность: каждый /api/admin/* обязан проверять роль на сервере.
 */
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isLoading, isAdmin } = useAuth();

  // Сессия ещё проверяется через getMe(). Показать 403 здесь — значит мигнуть
  // «доступ закрыт» админу при F5; вернуть null — белая вспышка и скачок вёрстки.
  if (isLoading) {
    return (
      <>
        <Nav />
        <main>
          <div className="admin-boot">
            <span className="auth-spinner" />
            <p>Проверяем доступ…</p>
          </div>
        </main>
      </>
    );
  }

  if (!isAdmin) return <AccessDeniedPage />;

  return <>{children}</>;
}
