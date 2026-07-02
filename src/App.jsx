import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from './store/slices/authSlice';

// Pages
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import RestaurantsPage    from './pages/RestaurantsPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import CartPage           from './pages/CartPage';
import CheckoutPage       from './pages/CheckoutPage';
import OrdersPage         from './pages/OrdersPage';
import MerchantRegisterPage from './pages/MerchantRegisterPage';

// Merchant Pages
import MerchantDashboard  from './pages/merchant/MerchantDashboard';
import MerchantOrders     from './pages/merchant/MerchantOrders';
import MerchantMenu       from './pages/merchant/MerchantMenu';
import MerchantReviews    from './pages/merchant/MerchantReviews';

// Admin Pages
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminRestaurants   from './pages/admin/AdminRestaurants';
import AdminCoupons       from './pages/admin/AdminCoupons';
import AdminUsers         from './pages/admin/AdminUsers';
import AdminSettings      from './pages/admin/AdminSettings';

// Auth Guard
import ProtectedRoute     from './components/auth/ProtectedRoute';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/"                   element={<HomePage />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        <Route path="/restaurants"        element={<RestaurantsPage />} />
        <Route path="/restaurant/:id"     element={<RestaurantDetailPage />} />
        <Route path="/merchant/register"  element={<MerchantRegisterPage />} />

        {/* Customer Protected Routes */}
        <Route path="/cart"     element={<ProtectedRoute allowedRoles={['customer']}><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute allowedRoles={['customer']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders"   element={<ProtectedRoute allowedRoles={['customer']}><OrdersPage /></ProtectedRoute>} />

        {/* Merchant Protected Routes */}
        <Route path="/merchant/dashboard" element={<ProtectedRoute allowedRoles={['merchant']}><MerchantDashboard /></ProtectedRoute>} />
        <Route path="/merchant/orders"    element={<ProtectedRoute allowedRoles={['merchant']}><MerchantOrders /></ProtectedRoute>} />
        <Route path="/merchant/menu"      element={<ProtectedRoute allowedRoles={['merchant']}><MerchantMenu /></ProtectedRoute>} />
        <Route path="/merchant/reviews"   element={<ProtectedRoute allowedRoles={['merchant']}><MerchantReviews /></ProtectedRoute>} />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard"   element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/restaurants" element={<ProtectedRoute allowedRoles={['admin']}><AdminRestaurants /></ProtectedRoute>} />
        <Route path="/admin/coupons"     element={<ProtectedRoute allowedRoles={['admin']}><AdminCoupons /></ProtectedRoute>} />
        <Route path="/admin/users"       element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/settings"    element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
