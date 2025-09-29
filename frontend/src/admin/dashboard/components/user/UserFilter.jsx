import { motion } from "framer-motion";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

const UserFilter = ({
  searchTerm,
  handleSearch,
  selectedRole,
  handleRoleFilter,
  availableRoles,
  roleCounts,
  clearFilters,
  debouncedSearch,
}) => {
  const hasActiveFilters = selectedRole !== "all" || debouncedSearch !== "";
  return (
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white transition-colors duration-200 outline-emerald-500"
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
  );
};

export default UserFilter;
