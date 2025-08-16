//hooks
import { useContext, useState } from "react";

//libraries
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

//utilities
import { showError, showSuccess } from "../utils/Alert";

//context
import AuthContext from "../context/AuthContext";

//components UI
import Loading from "../../components/ui/Loading";

const LoginPage = () => {
  // context
  const { login } = useContext(AuthContext);

  //Router
  const navigate = useNavigate();

  //initial form
  const initailFormState = {
    email: "",
    password: "",
  };

  // state hook
  const [form, setForm] = useState(initailFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      showError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const response = await login(form);

      if (response.token) {
        showSuccess("Login Successful!");
        setForm(initailFormState);
        navigate(
          response.user?.role === "admin"
            ? "/admin/membership-plans"
            : "/dashboard"
        );
      }
    } catch (error) {
      showError(error.response?.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0d1117] dark:text-[#f0f6fc] px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] shadow-xl rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              value={form.email}
              type="email"
              name="email"
              placeholder="john@example.com"
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                value={form.password}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="mt-1 w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
              {/* Icon is static now — you'll add toggle logic later */}
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500"
          >
            Sign up
          </Link>
        </div>

        {/* Social Login Section */}
        <div className="mt-6">
          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-[#161b22]">
              or sign up with
            </span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-4">
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FaFacebook className="text-xl text-blue-600" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FcGoogle className="text-xl" />
            </button>
            <button className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#0d1117] transition duration-200 cursor-pointer">
              <FaGithub className="text-xl text-gray-900 dark:text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
