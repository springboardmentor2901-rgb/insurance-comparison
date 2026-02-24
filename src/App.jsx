import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClaimsProvider } from './context/ClaimsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import QuoteFormPage from './pages/QuoteFormPage';
import QuoteResultsPage from './pages/QuoteResultsPage';
import PolicyComparatorPage from './pages/PolicyComparatorPage';
import PremiumCalculatorPage from './pages/PremiumCalculatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ClaimFilingPage from './pages/ClaimFilingPage';
import ClaimTrackingPage from './pages/ClaimTrackingPage';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return (
        <div className="page">
            <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
            </div>
        </div>
    );
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppContent() {
    const { isAuthenticated } = useAuth();

    return (
        <>
            {isAuthenticated && <Navbar />}
            <main>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
                    <Route path="/" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/get-quote" element={<ProtectedRoute><QuoteFormPage /></ProtectedRoute>} />
                    <Route path="/quote-results" element={<ProtectedRoute><QuoteResultsPage /></ProtectedRoute>} />
                    <Route path="/compare" element={<ProtectedRoute><PolicyComparatorPage /></ProtectedRoute>} />
                    <Route path="/calculator" element={<ProtectedRoute><PremiumCalculatorPage /></ProtectedRoute>} />
                    <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
                    <Route path="/file-claim" element={<ProtectedRoute><ClaimFilingPage /></ProtectedRoute>} />
                    <Route path="/track-claim" element={<ProtectedRoute><ClaimTrackingPage /></ProtectedRoute>} />
                </Routes>
            </main>
            {isAuthenticated && <Footer />}
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <ClaimsProvider>
                    <AppContent />
                </ClaimsProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
