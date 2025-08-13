import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import MembersPage from "./pages/member/MembersPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={"/members"} element={<MembersPage />} />
        <Route path={"/register"} element={<RegisterPage />} />
        <Route path={"/login"} element={<LoginPage />} />c
      </Routes>
    </Router>
  );
};

export default App;
