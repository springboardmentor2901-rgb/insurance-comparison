import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClaimsProvider } from './context/ClaimsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import QuoteFormPage from './pages/QuoteFormPage';
import QuoteResultsPage from './pages/QuoteResultsPage';
import PolicyComparatorPage from './pages/PolicyComparatorPage';
import PremiumCalculatorPage from './pages/PremiumCalculatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ClaimFilingPage from './pages/ClaimFilingPage';
import ClaimTrackingPage from './pages/ClaimTrackingPage';
import ClaimHistoryPage from './pages/ClaimHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="page"><div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div></div>;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    if (loading) return <div className="page"><div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}

function AppRoutes() {
    const { isAuthenticated, isAdmin } = useAuth();
    const adminHome = isAdmin ? '/admin' : '/';

    return (
        <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to={adminHome} replace /> : <LoginPage />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to={adminHome} replace /> : <RegisterPage />} />
            <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <ProtectedRoute><LandingPage /></ProtectedRoute>} />
            <Route path="/get-quote" element={<ProtectedRoute><QuoteFormPage /></ProtectedRoute>} />
            <Route path="/quote-results" element={<ProtectedRoute><QuoteResultsPage /></ProtectedRoute>} />
            <Route path="/compare" element={<ProtectedRoute><PolicyComparatorPage /></ProtectedRoute>} />
            <Route path="/calculator" element={<ProtectedRoute><PremiumCalculatorPage /></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
            <Route path="/file-claim" element={<ProtectedRoute><ClaimFilingPage /></ProtectedRoute>} />
            <Route path="/track-claim" element={<ProtectedRoute><ClaimTrackingPage /></ProtectedRoute>} />
            <Route path="/claim-history" element={<ProtectedRoute><ClaimHistoryPage /></ProtectedRoute>} />
            <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
    );
}

function AppLayout() {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');
    return (
        <>
            {isAuthenticated && <Navbar />}
            <main>
                <AppRoutes />
            </main>
            {isAuthenticated && !isAdminPage && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ClaimsProvider>
                    <AppLayout />
                </ClaimsProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
