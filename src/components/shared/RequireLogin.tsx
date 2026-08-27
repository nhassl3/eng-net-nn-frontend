import type React from 'react'
import { useAuth } from '../../context/AuthContext'
import { AuthorizationPage } from '../../pages/AuthorizationPage'
import { Nav } from '../layout/Nav'

/**
 * Защита user-маршрутов. Рендерит /login НА МЕСТЕ, без редиректа — адрес
 * /user-plans/... остаётся в строке браузера.
 *
 * Это UX, а не безопасность: каждый /api/user-plans/* обязан проверять роль на сервере.
 */
export function RequireLogin({ children }: { children: React.ReactNode }) {
	const { isLoading, isAuthenticated } = useAuth();

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

	if (!isAuthenticated) return <AuthorizationPage />;

	return <>{children}</>;
}
