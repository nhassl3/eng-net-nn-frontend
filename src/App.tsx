import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PlansTab } from './components/admin/plans/PlansTab'
import { VacanciesTab } from './components/admin/vacancies/VacanciesTab'
import { CursorBlob } from './components/shared/CursorBlob'
import { RequireAdmin } from './components/shared/RequireAdmin'
import { AuthProvider } from './context/AuthContext'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { AdminPage } from './pages/AdminPage'
import { AuthorizationPage } from './pages/AuthorizationPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ServerErrorPage } from './pages/ServerErrorPage'
import { UserPlansPage } from './pages/UserPlansPage'
import { VacanciesPage } from './pages/VacanciesPage'
import { store } from './store'

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/user-plans" element={<UserPlansPage />} />
          <Route path="/admin" element={<RequireAdmin><AdminPage /></RequireAdmin>}>
            <Route index element={<Navigate to="vacancies" replace />} />
            <Route path="vacancies" element={<VacanciesTab />} />
            <Route path="plans" element={<PlansTab />} />
            <Route path="*" element={<Navigate to="/admin/vacancies" replace />} />
          </Route>
          <Route path="/auth" element={<AuthorizationPage />} />
          <Route path="/403" element={<AccessDeniedPage />} />
          <Route path="/500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <CursorBlob />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}
