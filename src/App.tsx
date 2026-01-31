import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { ToastProvider } from './lib/ToastContext';
import ToastContainer from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Marketplace from './pages/Marketplace';
import CafecitoNew from './pages/CafecitoNew';
import PostDetail from './pages/PostDetail';
import Eventos from './pages/Eventos';
import Fest from './pages/Fest';
import ProfileNew from './pages/ProfileNew';
import Valores from './pages/Valores';
import Pilares from './pages/Pilares';
import Circulos from './pages/Circulos';
import CirculoDetail from './pages/CirculoDetail';
import Intercambio from './pages/Intercambio';
import Trueque from './pages/Trueque';
import ConexionPropuestas from './pages/ConexionPropuestas';
import Servicios from './pages/Servicios';
import TiempoCompartido from './pages/TiempoCompartido';
import EnConstruccion from './pages/EnConstruccion';
import Contacto from './pages/Contacto';
import NotFound from './pages/NotFound';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const showOnboarding = !loading && user && profile && profile.onboarding_completed === false;

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FAF7F2] overflow-x-hidden max-w-[100vw]">
        <Navbar />
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/olvidar-contrasena" element={<ForgotPassword />} />
            <Route path="/restablecer-contrasena" element={<ResetPassword />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/cafecito" element={<CafecitoNew />} />
            <Route path="/cafecito/:postId" element={<PostDetail />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/fest" element={<Fest />} />
            <Route path="/perfil" element={<ProfileNew />} />
            <Route path="/perfil/:userId" element={<ProfileNew />} />
            <Route path="/valores" element={<Valores />} />
            <Route path="/pilares" element={<Pilares />} />
            <Route path="/circulos" element={<Circulos />} />
            <Route path="/circulos/:circuloId" element={<CirculoDetail />} />
            <Route path="/intercambio" element={<Intercambio />} />
            <Route path="/intercambio/trueque" element={<Trueque />} />
            <Route path="/intercambio/conexion-propuestas" element={<ConexionPropuestas />} />
            <Route path="/intercambio/servicios" element={<Servicios />} />
            <Route path="/intercambio/tiempo" element={<TiempoCompartido />} />
            <Route path="/intercambio/:section" element={<EnConstruccion />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
      {showOnboarding && <OnboardingModal />}
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
