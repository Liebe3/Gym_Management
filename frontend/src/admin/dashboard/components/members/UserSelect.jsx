import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import userService from "../../../../services/userService";

const UserSelect = ({
  value,
  onChange,
  mode,
  selectedUserActivePlan,
  checkingActivePlan,
  disabled,
}) => {
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const userResponse = await userService.getAllUser({ all: true });
        const allUsers = userResponse?.data || [];

        // Filter out users with roles of 'trainer' or 'admin'
        const filteredUsers = allUsers.filter(
          (user) => user.role !== "trainer" && user.role !== "admin"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        User
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled || mode === "update"}
        className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          disabled || mode === "update"
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400"
            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
        }`}
      >
        <option value="">Select a user</option>
        {Array.isArray(users) &&
          users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
      </select>

      {mode === "update" && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          User cannot be changed when updating
        </p>
      )}

      {!userLoading && users.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          No eligible users found (trainers and admins are excluded)
        </p>
      )}

      {mode === "create" && checkingActivePlan && (
        <div className="mt-2 flex items-center text-blue-600 dark:text-blue-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-xs">Checking active membership...</span>
        </div>
      )}

      {mode === "create" && selectedUserActivePlan && (
        <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-start">
            <FiAlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                Existing Membership Found
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                This user already has a membership record (
                {selectedUserActivePlan.status}).
                {selectedUserActivePlan.status === "active"
                  ? ` Active until ${new Date(
                      selectedUserActivePlan.endDate
                    ).toLocaleDateString()}.`
                  : " This membership is inactive. Please update or reactivate it instead of creating a new one."}
              </p>
            </div>
          </div>
        </div>
      )}

      {mode === "create" &&
        value &&
        !checkingActivePlan &&
        !selectedUserActivePlan && (
          <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
            <FiCheckCircle className="w-4 h-4 mr-2" />
            <span className="text-xs">User is available for new membership</span>
          </div>
        )}
    </div>
  );
};

export default UserSelect;