import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utils/Alert";

import { registerUser } from "../../services/AuthService";

const RegisterPage = () => {
  const initailFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [form, setForm] = useState(initailFormState);

  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      showError("Passwords don't match");
      return;
    }

    try {
      const response = await registerUser(form);

      // Only runs if request succeeded
      showSuccess(response.message);
      navigate("/login");
      setForm(initailFormState);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error registering user";
      showError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0d1117] dark:text-[#f0f6fc] px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#161b22] shadow-xl rounded-2xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Create an Account</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* first name */}
            <div>
              <label className="text-sm font-medium">First Name</label>
              <input
                value={form.firstName}
                type="text"
                name="firstName"
                placeholder="John"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
            </div>

            {/* last namee */}
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <input
                value={form.lastName}
                type="text"
                name="lastName"
                placeholder="Doe"
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* email */}
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
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="mt-1 w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          {/* confirm password */}
          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <input
                value={form.confirmPassword}
                type={confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                className="mt-1 w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-600 dark:text-gray-400"
                onClick={() => setConfirmPassword(!confirmPassword)}
              >
                {confirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <input type="checkbox" required className="accent-blue-600" />
            <label>
              I agree to the{" "}
              <Link className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500">
                Terms
              </Link>{" "}
              and{" "}
              <Link className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition duration-200"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
