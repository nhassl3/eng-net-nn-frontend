import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AccessDeniedPage } from './pages/AccessDeniedPage'
import { AuthorizationPage } from './pages/AuthorizationPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ServerErrorPage } from './pages/ServerErrorPage'
import { VacanciesPage } from './pages/VacanciesPage'
import { CursorBlob } from './components/shared/CursorBlob'
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
