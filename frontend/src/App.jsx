import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import LoginPage from "./auth/LoginPages";
import RegisterPage from "./auth/RegisterPage";
import AdminRoutes from "./routes/AdminRoutes";
import MemberRoutes from "./routes/MemberRoutes";
import TrainerRoutes from "./routes/TrainerRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-based Routes */}

        {AdminRoutes()}
        {TrainerRoutes()}
        {MemberRoutes()}

        {/* Catch-all */}
        <Route path="/unauthorized" element={<h1>Access Denied</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
