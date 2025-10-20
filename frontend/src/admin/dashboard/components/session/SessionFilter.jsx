import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import trainerService from "../../../../services/trainerService";

const availableStatus = [
  { value: "all", label: "All Sessions" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SessionFilter = ({
  selectedStatus,
  handleStatusFilter,
  selectedTrainer,
  handleTrainerFilter,
  clearFilters,
  statusCount,
  debouncedSearch,
}) => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const loadTrainers = async () => {
      try {
        const response = await trainerService.getAllTrainer({
          status: "active",
          all: true,
        });
        if (response.success) {
          setTrainers(response.data || []);
        }
      } catch (error) {
        console.error("Error loading trainers:", error);
      }
    };

    loadTrainers();
  }, []);

  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedTrainer !== "all" ||
    debouncedSearch !== "";

  const getTrainerName = (trainer) => {
    if (!trainer || !trainer.user) return "Unknown";
    return `${trainer.user.firstName} ${trainer.user.lastName}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header with Schedule Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Training Sessions
        </h2>
      </div>

      {/* Trainer Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by Trainer
        </label>
        <select
          value={selectedTrainer}
          onChange={(e) => handleTrainerFilter(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-800 dark:text-gray-200"
        >
          <option value="all">All Trainers</option>
          {trainers.map((trainer) => (
            <option key={trainer._id} value={trainer._id}>
              {getTrainerName(trainer)}
            </option>
          ))}
        </select>
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

export default SessionFilter;
