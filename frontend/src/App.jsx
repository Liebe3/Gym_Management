import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AdminRoutes } from "./routes/AdminRoutes";
import { TrainerRoutes } from "./routes/TrainerRoutes";
import LoginPage from "./auth/LoginPages";
import RegisterPage from "./auth/RegisterPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-based Routes */}
        {AdminRoutes}
        {TrainerRoutes}

        {/* Catch-all */}
        <Route path="/unauthorized" element={<h1>Access Denied</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
