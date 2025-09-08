//hooks
import { useContext, useState } from "react";

//libraries
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

//utilities
import { showError, showSuccess } from "../pages/utils/Alert";

//comtext
import AuthContext from "../pages/context/AuthContext";

//componets UI
import Loading from "../components/ui/Loading";

const RegisterPage = () => {
  // context
  const { register } = useContext(AuthContext);

  //Router
  const navigate = useNavigate();

  //initial form
  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // state hook
  const [form, setForm] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      showError("Password dont match");
      return;
    }
    try {
      setLoading(true);
      await register(form);
      showSuccess("Registered successfully!");
      setForm(initialFormState);
      navigate("/login");
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-emerald-600">
            Create an Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign up to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                placeholder="John"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                placeholder="Doe"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="john@example.com"
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <input type="checkbox" required className="accent-emerald-600" />
            <label>
              I agree to the{" "}
              <Link
                to={"/terms"}
                className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                to={"/privacy"}
                className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500 dark:hover:text-emerald-300"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-medium shadow-lg transition duration-200 cursor-pointer"
          >
            Create Account
          </button>
        </form>

        {/* Already have an account */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-500 dark:hover:text-emerald-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
