import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClaimsProvider } from './context/ClaimsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PolicyComparatorPage from './pages/PolicyComparatorPage';
import PremiumCalculatorPage from './pages/PremiumCalculatorPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ClaimFilingPage from './pages/ClaimFilingPage';
import ClaimTrackingPage from './pages/ClaimTrackingPage';

function App() {
    return (
        <Router>
            <ClaimsProvider>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/compare" element={<PolicyComparatorPage />} />
                        <Route path="/calculator" element={<PremiumCalculatorPage />} />
                        <Route path="/recommendations" element={<RecommendationsPage />} />
                        <Route path="/file-claim" element={<ClaimFilingPage />} />
                        <Route path="/track-claim" element={<ClaimTrackingPage />} />
                    </Routes>
                </main>
                <Footer />
            </ClaimsProvider>
        </Router>
    );
}

export default App;
