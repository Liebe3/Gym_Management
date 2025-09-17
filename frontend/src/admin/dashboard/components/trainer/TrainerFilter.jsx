import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

// Available status options for trainers
const availableStatus = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
];

const TrainerFilter = ({
  selectedStatus,
  handleStatusFilter,
  searchTerm,
  handleSearch,
  clearFilters,
  statusCount = {},
}) => {
  const hasActiveFilters = selectedStatus !== "all" || searchTerm !== "";

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
          Search Trainers
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

      {/* Status Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FiFilter className="w-5 h-5 text-emerald-600 mr-2" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Status
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
          {availableStatus.map((status) => {
            const count = statusCount[status.value] || 0;
            const isSelected = selectedStatus === status.value;

            return (
              <motion.button
                key={status.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <span>{status.label}</span>
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

export default TrainerFilter;