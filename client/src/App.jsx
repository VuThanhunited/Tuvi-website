import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { FavoritesProvider } from './contexts/FavoritesContext.jsx';
import { ToastProvider } from './components/Toast/Toast.jsx';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Chatbot from './components/Chatbot/Chatbot.jsx';

// Pages
import Home from './pages/Home.jsx';
import XemTuVi from './pages/XemTuVi.jsx';
import TuViResult from './pages/TuViResult.jsx';
import HoroscopePage from './pages/HoroscopePage.jsx';
import KienThucPage from './pages/KienThucPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FAQPage from './pages/FAQPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import DanhSachThayPage from './pages/DanhSachThayPage.jsx';
import HuongDanPage from './pages/HuongDanPage.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <FavoritesProvider>
            <div className="app">
              <Header />
              <main>
                <Routes>
                  {/* ── PUBLIC ROUTES ── */}
                  <Route path="/" element={<Home />} />
                  <Route path="/bai-viet" element={<Home />} />
                  <Route path="/xem-tu-vi" element={<XemTuVi />} />
                  <Route path="/la-so" element={<XemTuVi />} />
                  <Route path="/ket-qua" element={<TuViResult />} />
                  <Route path="/horoscope" element={<HoroscopePage />} />
                  <Route path="/horoscope/:sign" element={<HoroscopePage />} />
                  <Route path="/kien-thuc" element={<KienThucPage />} />
                  <Route path="/dang-nhap" element={<LoginPage />} />
                  <Route path="/dang-ky" element={<RegisterPage />} />
                  <Route path="/ve-chung-toi" element={<AboutPage />} />
                  <Route path="/lien-he" element={<ContactPage />} />
                  <Route path="/dieu-khoan" element={<TermsPage />} />
                  <Route path="/bao-mat" element={<PrivacyPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/cong-dong" element={<CommunityPage />} />
                  <Route path="/mxh" element={<CommunityPage />} />
                  <Route path="/danh-sach-thay" element={<DanhSachThayPage />} />
                  <Route path="/huong-dan" element={<HuongDanPage />} />

                  {/* ── AUTHENTICATED ROUTES (cần đăng nhập) ── */}
                  <Route path="/lich-su" element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/la-so-cua-ban" element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/yeu-thich" element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } />

                  {/* ── 404 ── */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          </FavoritesProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
