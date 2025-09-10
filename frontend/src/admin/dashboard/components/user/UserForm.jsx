import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import userService from "../../../../services/userService";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isUpdatedMode = mode === "update" && selectedUser;
    if (isUpdatedMode) {
      setForm({
        firstName: selectedUser.firstName || "",
        lastName: selectedUser.lastName || "",
        email: selectedUser.email || "",
        password: "",
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, selectedUser]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await userService.createUser(form);
      showSuccess(response.message || "User created successfully");
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage = error?.message || "Failed to create user";
      console.error("Error details", error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (!selectedUser) {
      showError("No member selected for update");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
      };

      // Only include password if it's provided
      if (form.password.trim()) {
        userData.password = form.password;
      }

      const result = await userService.updateUser(selectedUser._id, userData);

      if (result.success) {
        showSuccess("User updated successfully");
        if (onSuccess) onSuccess();
      } else {
        showError(result.message || "Error updating member");
      }
    } catch (error) {
      if (error.response?.data?.messge) {
        showError(error.response.data.message);
      } else {
        showError("Failed to update member");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === formModes.Create) {
      await handleCreateUser(event);
    } else {
      await handleUpdateUser(event);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
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
              type="email"
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
              Password{" "}
              {mode === "update" && (
                <span className="text-gray-500">
                  (Leave empty to keep current)
                </span>
              )}
            </label>
            <input
              value={form.password}
              type="password"
              name="password"
              placeholder="Enter password"
              required={mode === formModes.Create} // required allow only in creationg
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Role - Only show for create mode */}
          {mode === "create" && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={form.role}
                name="role"
                required
                disabled={loading}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
              >
                <option value="user">User</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3">
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
              {loading
                ? mode === "update"
                  ? "Updating..."
                  : "Creating..."
                : mode === "update"
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
