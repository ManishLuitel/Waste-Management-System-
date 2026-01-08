import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SpecialRequestForm from './components/SpecialRequestForm'
import ScheduleViewer from './components/ScheduleViewer'
import Navbar from './components/Navbar'
import SpecialRequestViewer from './components/SpecialRequestViewer'
import CompostRequestForm from './components/CompostRequestForm'
import CompostRequestViewer from './components/CompostRequestViewer'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import AdminScheduleManager from "./admin/AdminScheduleManager"
import AdminDashboard from './admin/AdminDashboard'
import AdminSpecialRequests from "./admin/AdminSpecialRequests"
import AdminCompostRequests from "./admin/AdminCompostRequests"
import WasteTypeManager from "./admin/WasteTypeManager"
import CollectionDayManager from "./admin/CollectionDayManager"
import WardManager from "./admin/WardManager"
import UserManager from "./admin/UserManager"
import UserLogin from "./pages/UserLogin";
import Signup from "./pages/Signup";
import UserForgotPassword from "./pages/UserForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyRequests from "./pages/MyRequests";
import PasswordResetManager from "./admin/PasswordResetManager";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import DashboardHome from "./pages/DashboardHome";
import OurInitiative from "./pages/OurInitiative";
import MonthlyPayment from "./pages/MonthlyPayment";
import PaymentHistory from "./pages/PaymentHistory";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import AdminPaymentSettings from "./admin/AdminPaymentSettings";
import AdminPaymentManager from "./admin/AdminPaymentManager";
import AdminPaymentStats from "./admin/AdminPaymentStats";
import UserPaymentStats from "./pages/UserPaymentStats";
import UserInvoices from "./pages/UserInvoices";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes with Navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/schedule" element={<ScheduleViewer />} />
              <Route path="/our-initiative" element={<OurInitiative />} />
              <Route path="/compost-requests" element={<CompostRequestViewer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/user-forgot-password" element={<UserForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />

              {/* Protected routes for users */}
              <Route
                path="/special-request"
                element={
                  <ProtectedRoute>
                    <SpecialRequestForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compost-request"
                element={
                  <ProtectedRoute>
                    <CompostRequestForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-requests"
                element={
                  <ProtectedRoute>
                    <MyRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/special-requests"
                element={
                  <ProtectedRoute>
                    <SpecialRequestViewer />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </>
        } />

        {/* User Dashboard routes without Navbar */}
        <Route path="/user-dashboard" element={<UserDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="schedule" element={<ScheduleViewer />} />
          <Route path="special-request" element={<SpecialRequestForm />} />
          <Route path="compost-request" element={<CompostRequestForm />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="monthly-payment" element={<MonthlyPayment />} />
          <Route path="payment-history" element={<PaymentHistory />} />
          <Route path="invoices" element={<UserInvoices />} />
          <Route path="payment-stats" element={<UserPaymentStats />} />
        </Route>

        {/* Admin routes without Navbar */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminScheduleManager />} />
          <Route path="schedules" element={<AdminScheduleManager />} />
          <Route path="special-requests" element={<AdminSpecialRequests />} />
          <Route path="compost-requests" element={<AdminCompostRequests />} />
          <Route path="users" element={<UserManager />} />
          <Route path="payment-settings" element={<AdminPaymentSettings />} />
          <Route path="payment-manager" element={<AdminPaymentManager />} />
          <Route path="payment-stats" element={<AdminPaymentStats />} />
          <Route path="password-resets" element={<PasswordResetManager />} />
          <Route path="waste-types" element={<WasteTypeManager />} />
          <Route path="collection-days" element={<CollectionDayManager />} />
          <Route path="wards" element={<WardManager />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
