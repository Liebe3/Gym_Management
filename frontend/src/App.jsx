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
import DashboardLayout from "./admin/dashboard/DashboardLayout";
import MemberShipPlansSection from "./admin/dashboard/components/MemberShipPlansSection";
import MemberSection from "./admin/dashboard/components/MemberSection";

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
                <MemberSection/>
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
