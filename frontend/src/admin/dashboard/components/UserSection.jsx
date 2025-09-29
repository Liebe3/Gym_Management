import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import userService from "../../../services/userService";
import UserModal from "../components/ui/UserModal";
import UserFilter from "./user/UserFilter";
import UserTable from "./user/UserTable";

// Available roles
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
        setRoleCounts(response.filter?.counts?.role || {});
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
    setMode("update");
    setIsModalOpen(true);
    setSelectedUser(user);
  };

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

        {/* Filter */}
        <UserFilter
          selectedRole={selectedRole}
          handleRoleFilter={handleRoleFilter}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          availableRoles={availableRoles}
          roleCounts={roleCounts}
          debouncedSearch={debouncedSearch}
        />

        <UserTable
          users={users}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          handleOpenCreate={handleOpenCreate}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

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
