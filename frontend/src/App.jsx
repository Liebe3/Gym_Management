import { jwtDecode } from "jwt-decode";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./auth/LoginPages";
import RegisterPage from "./auth/RegisterPage";
import Dashboard from "./admin/dashboard/Dashboard";
import UserSection from "./admin/dashboard/components/UserSection";
import DashboardLayout from "./admin/dashboard/DashboardLayout";
import MemberShipPlansSection from "./admin/dashboard/components/MemberShipPlansSection";
import MemberSection from "./admin/dashboard/components/MemberSection";
// import MembersForm from "./admin/dashboard/components/members/MembersForm";
// import MemberManagement from "./admin/dashboard/components/members/MemberManagement";
// import PaymentForm from "./admin/dashboard/components/members/PaymentForm";
// import UserForm from "./admin/dashboard/components/user/UserForm";
// import UserModal from "./admin/dashboard/components/ui/UserModal";
// import MemberModal from "./admin/dashboard/components/ui/MemberModal";
import TrainerSection from "./admin/dashboard/components/TrainerSection";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  let role = null;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* <Route path="/create-member" element={<MemberManagement/>}/>
         <Route path="/payment" element={<PaymentForm/>}/> */}

        {/* Admin Routes (all share the same Sidebar layout) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/membership-plans"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <MemberShipPlansSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/member"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <MemberSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/trainer"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <TrainerSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/user"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout>
                <UserSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="/unauthorized" element={<h1>Access Denied</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
