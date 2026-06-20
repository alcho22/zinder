import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/PublicLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Categories from './pages/public/Categories';
import CategoryDetail from './pages/public/CategoryDetail';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Providers from './pages/public/Providers';
import ProviderProfile from './pages/public/ProviderProfile';
import LegalPage from './pages/public/LegalPage';
import Faq from './pages/public/Faq';
import NotFound from './pages/public/NotFound';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOtp from './pages/auth/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Customer
import { CustomerLayout } from './pages/customer/CustomerLayout';
import CustomerOverview from './pages/customer/Overview';
import CustomerProfile from './pages/customer/Profile';
import Addresses from './pages/customer/Addresses';
import Vehicles from './pages/customer/Vehicles';
import VehicleForm from './pages/customer/VehicleForm';
import CustomerOrders from './pages/customer/Orders';
import CustomerOrderDetail from './pages/customer/OrderDetail';
import CustomerNotifications from './pages/customer/Notifications';
import BecomeProvider from './pages/customer/BecomeProvider';
import RequestService from './pages/customer/RequestService';

// Provider
import { ProviderLayout } from './pages/provider/ProviderLayout';
import ProviderOverview from './pages/provider/Overview';
import ProviderProfileEdit from './pages/provider/ProfileEdit';
import ProviderDocuments from './pages/provider/Documents';
import ProviderServices from './pages/provider/Services';
import ProviderServiceForm from './pages/provider/ServiceForm';
import ProviderOrders from './pages/provider/Orders';
import ProviderOrderDetail from './pages/provider/OrderDetail';
import ProviderWallet from './pages/provider/Wallet';
import ProviderNotifications from './pages/provider/Notifications';

// Admin
import { AdminLayout } from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminApprovals from './pages/admin/Approvals';
import AdminCategories from './pages/admin/Categories';
import AdminServices from './pages/admin/Services';
import AdminServiceOptions from './pages/admin/ServiceOptions';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:slug" element={<CategoryDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/providers/:id" element={<ProviderProfile />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/privacy-policy" element={<LegalPage doc="privacy" />} />
        <Route path="/terms" element={<LegalPage doc="terms" />} />
        <Route path="/sms-terms" element={<LegalPage doc="sms" />} />
        <Route path="/refund-policy" element={<LegalPage doc="refund" />} />
        <Route path="/provider-agreement" element={<LegalPage doc="provider-agreement" />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Customer dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CustomerOverview />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="vehicles" element={<Vehicles />} />
        <Route path="vehicles/new" element={<VehicleForm />} />
        <Route path="vehicles/:id/edit" element={<VehicleForm />} />
        <Route path="orders" element={<CustomerOrders />} />
        <Route path="orders/:id" element={<CustomerOrderDetail />} />
        <Route path="notifications" element={<CustomerNotifications />} />
        <Route path="become-provider" element={<BecomeProvider />} />
      </Route>
      {/* Request/order creation flow (full-screen, outside the dashboard chrome) */}
      <Route
        path="/request"
        element={
          <ProtectedRoute>
            <RequestService />
          </ProtectedRoute>
        }
      />

      {/* Provider dashboard */}
      <Route
        path="/provider"
        element={
          <ProtectedRoute roles={['provider', 'admin']}>
            <ProviderLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/provider/dashboard" replace />} />
        <Route path="dashboard" element={<ProviderOverview />} />
        <Route path="profile" element={<ProviderProfileEdit />} />
        <Route path="documents" element={<ProviderDocuments />} />
        <Route path="services" element={<ProviderServices />} />
        <Route path="services/new" element={<ProviderServiceForm />} />
        <Route path="services/:id/edit" element={<ProviderServiceForm />} />
        <Route path="orders" element={<ProviderOrders />} />
        <Route path="orders/:id" element={<ProviderOrderDetail />} />
        <Route path="wallet" element={<ProviderWallet />} />
        <Route path="notifications" element={<ProviderNotifications />} />
      </Route>

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="providers" element={<AdminProviders />} />
        <Route path="provider-approvals" element={<AdminApprovals />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="service-options" element={<AdminServiceOptions />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
