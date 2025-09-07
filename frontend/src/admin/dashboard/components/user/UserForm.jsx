import { useEffect, useState } from "react";
import userService from "../../../../services/userService";
import { showSuccess, showError } from "../../../../pages/utils/Alert";
const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "user",
};

const formModes = {
  Create: "create",
  Update: "update",
};

const UserForm = ({ selectedUser, onSuccess, mode = formModes.Create }) => {
  const [form, setForm] = useState(initialForm);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    try {
      let response;
      if (mode === "create") {
        response = await userService.createUser(form);
      }

      showSuccess(response.message || "User create Successfully");
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error?.message || "Failed to create user";
      console.error("Error details", error);
      showError(errorMessage);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleCreateUser} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* firstname */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              value={form.firstName}
              type="text"
              name="firstName"
              placeholder="John"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Lastname */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              value={form.lastName}
              type="text"
              name="lastName"
              placeholder="Doe"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              value={form.email}
              type="text"
              name="email"
              placeholder="john@example.ocm"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              value={form.password}
              type="password"
              name="password"
              placeholder="Enter password"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              value={form.role}
              name="role"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="user">User</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setForm(initialForm)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition duration-200 cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
