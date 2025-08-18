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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
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
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/membership-plans"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MemberShipPlansSection />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
