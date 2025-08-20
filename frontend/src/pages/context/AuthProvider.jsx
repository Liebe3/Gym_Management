// hooks
import { useEffect, useState } from "react";

//context
import AuthContext from "./AuthContext";

//services
import { AuthService } from "../../services/AuthService";
const AuthProvider = ({ children }) => {
  //state hook
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false)
  }, []);

  const register = async (formData) => {
    return await AuthService.registerUser(formData);
  };

  const login = async (credentials) => {
    const response = await AuthService.loginUser(credentials);

    if (response.token) {
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      setToken(response.token);
      localStorage.setItem("token", response.token);
    }
    return response;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
