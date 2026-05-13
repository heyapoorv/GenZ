import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';

// Create a component to handle global auth events that needs access to hooks
const AuthEventHandler = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear state and redirect without full reload
      useAuthStore.setState({ userInfo: null });
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [navigate]);

  return null;
};

function App() {
  const { userInfo } = useAuthStore();
  const { fetchCart, loadLocalCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (userInfo) {
      fetchCart();
      fetchWishlist();
    } else {
      loadLocalCart();
    }
  }, [userInfo, fetchCart, fetchWishlist, loadLocalCart]);

  return (
    <HelmetProvider>
      <Router>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: '#1e1e1e', color: '#fff', border: '1px solid #333' } }} />
        <AuthEventHandler />
        <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminPanel /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
