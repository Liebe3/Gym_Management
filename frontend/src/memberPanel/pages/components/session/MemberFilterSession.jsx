import { motion } from "framer-motion";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";

const MemberFilterSession = ({
  selectedTrainer,
  handleTrainerFilter,
  searchTerm,
  handleSearch,
  clearFilters,
  trainers = [],
  sessionCount = {},
}) => {
  const hasActiveFilters = selectedTrainer !== "all" || searchTerm !== "";

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
          Search Trainer
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search by trainer name"
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

      {/* Trainer Filter */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <FiFilter className="w-5 h-5 text-emerald-600 mr-2" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Trainer
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
          {/* All Sessions option */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleTrainerFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
              selectedTrainer === "all"
                ? "bg-emerald-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            <span>All Trainers</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                selectedTrainer === "all"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {sessionCount["all"] || 0}
            </span>
          </motion.button>

          {/* Trainer options */}
          {trainers &&
            trainers.length > 0 &&
            trainers.map((trainer) => {
              const trainerId = trainer._id || trainer.id;
              const trainerName =
                trainer.firstName && trainer.lastName
                  ? `${trainer.firstName} ${trainer.lastName}`
                  : trainer.user
                  ? `${trainer.user.firstName} ${trainer.user.lastName}`
                  : "Unknown Trainer";
              const count = sessionCount[trainerId] || 0;
              const isSelected = selectedTrainer === trainerId;

              return (
                <motion.button
                  key={trainerId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTrainerFilter(trainerId)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <span>{trainerName}</span>
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

export default MemberFilterSession;
