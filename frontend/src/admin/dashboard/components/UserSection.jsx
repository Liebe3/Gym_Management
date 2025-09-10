import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiEdit3,
  FiFilter,
  FiMail,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import userService from "../../../services/userService";
import UserModal from "../components/ui/UserModal";
import CreateUserButton from "./ui/createUserButton";

// Available roles from your schema
const availableRoles = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "trainer", label: "Trainer" },
  { value: "member", label: "Member" },
  { value: "user", label: "User" },
];

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleCounts, setRoleCounts] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const hasMounted = useRef(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filters object with current state
      const filters = {
        page: currentPage,
        limit,
      };

      // Only add role filter if not "all"
      if (selectedRole && selectedRole !== "all") {
        filters.role = selectedRole;
      }

      // Only add search if not empty
      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch.trim();
      }

      const response = await userService.getAllUser(filters);

      if (response.success) {
        setUsers(response.data || []);
        setPagination(response.pagination || {});
        setRoleCounts(response.filter?.counts || {});
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Handle role filter change
  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle search
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRole("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Initial load on component mount
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      loadUsers();
    }
  }, []); // Empty dependency array - only runs on mount

  // Load users when filters change (but not on initial mount)
  useEffect(() => {
    if (hasMounted.current) {
      loadUsers();
    }
  }, [debouncedSearch, selectedRole, currentPage]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setMode("update")
    setIsModalOpen(true)
    setSelectedUser(user)
  }

  const handleDelete = async (deleteId) => {
    try {
      const result = await ShowWarning("This action cannot be undone");
      if (result.isConfirmed) {
        await userService.deleteUser(deleteId);
        showSuccess("Member has been deleted");
        await loadUsers();
      }
    } catch (error) {
      console.error("Error deleting member", error);
      showError("Failed to delete the member");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMode("create");
    setSelectedUser(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-evenly">
        <p className="text-emerald-600 font-bold text-xl tracking-wide animate-pulse mt-5">
          Fetching users...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we load the available users
        </p>
        <div className="mt-[-100px]">
          <Loading />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </motion.div>
      </div>
    );

  const hasActiveFilters = selectedRole !== "all" || debouncedSearch !== "";

  return (
    <div className="w-full">
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-emerald-600 mb-2">
                Users
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Manage and organize your users
              </p>
            </div>
          </div>
        </motion.div>
        {/* Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          {/* Search Bar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Users
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg  dark:bg-gray-800 dark:text-white transition-colors duration-200 outline-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5 cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          {/* Role Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FiFilter className="w-5 h-5 text-emerald-600 mr-2" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Role
                </label>
              </div>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 text-sm cursor-pointer"
                >
                  <FiX className="w-4 h-4 mr-1 cursor-pointer" />
                  Clear All
                </motion.button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {availableRoles.map((role) => {
                const count = roleCounts[role.value] || 0;
                const isSelected = selectedRole === role.value;

                return (
                  <motion.button
                    key={role.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleFilter(role.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>{role.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* No Users */}
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              {hasActiveFilters ? (
                <FiFilter className="w-8 h-8 text-gray-400" />
              ) : (
                <FiUser className="w-8 h-8 text-gray-400" />
              )}
            </div>

            {hasActiveFilters ? (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  No users match your filters
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                  Try adjusting your search or role filter
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                  No users available.
                </p>
                <CreateUserButton
                  onClick={handleOpenCreate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Create Your First User
                  </div>
                </CreateUserButton>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <CreateUserButton onClick={handleOpenCreate}>
                <div className="flex items-center">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Creat new User
                </div>
              </CreateUserButton>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                        First name
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                        Last name
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-emerald-600" />
                        Email
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden md:table-cell">
                      <div className="flex items-center">
                        <FiTag className="w-4 h-4 mr-2 text-emerald-600" />
                        Role
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                          {user.firstName}
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                          {user.lastName}
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : user.role === "trainer"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : user.role === "member"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            {/* edit user action */}
                            <motion.button
                            onClick={() => handleOpenEdit(user)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Edit User"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </motion.button>

                            {/* delete user action */}
                            <motion.button
                              onClick={() => handleDelete(user._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Delete User"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages} —{" "}
                  {pagination.totalRecords} total users
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pagination.hasPrevPage
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Prev
                  </button>

                  {/* Numbered pages */}
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      return startPage + i;
                    }
                  )
                    .filter((page) => page <= pagination.totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                          currentPage === page
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pagination.hasNextPage
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <UserModal
          isModalOpen={isModalOpen}
          mode={mode}
          selectedUser={selectedUser}
          handleCloseModal={handleCloseModal}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default UserSection;
