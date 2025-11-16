import { AnimatePresence, motion } from "framer-motion";
import {
  FiCalendar,
  FiCheck,
  FiEdit3,
  FiEye,
  FiFilter,
  FiPlus,
  FiTag,
  FiTrash2,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { MdEventAvailable } from "react-icons/md";
import CreateTrainerButton from "../ui/CreateTrainerButton";
import StatusBadge from "./StatusBadge";
import WorkSchedule from "./WorkSchedule";

const TrainerTable = ({
  trainers = [],
  onEdit,
  onDelete,
  handleView,
  handleOpenCreate,
  hasActiveFilters,
  clearFilters,
  pagination = {},
  currentPage,
  setCurrentPage,
}) => {
  if (trainers.length === 0) {
    return (
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
              No trainers match your filters
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              Try adjusting your search or status filter
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Clear Filters
            </motion.button>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No trainers available.
            </p>
            <CreateTrainerButton onClick={handleOpenCreate}>
              <div className="flex items-center">
                <FiPlus className="w-4 h-4 mr-2" />
                Create Your First Trainer
              </div>
            </CreateTrainerButton>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <CreateTrainerButton onClick={handleOpenCreate}>
          <div className="flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Create New Trainer
          </div>
        </CreateTrainerButton>
      </div>

      {/* Trainers Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center">
                  <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                  Name
                </div>
              </th>

              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  md:table-cell">
                <div className="flex items-center">
                  <FiTag className="w-4 h-4 mr-2 text-emerald-600" />
                  Specializations
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  lg:table-cell">
                <div className="flex items-center">
                  <MdEventAvailable className="w-4 h-4 mr-2 text-emerald-600" />
                  Availability
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  lg:table-cell">
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                  Total Clients
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  lg:table-cell">
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                  Active Clients
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  lg:table-cell">
                <div className="flex items-center">
                  <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                  Total Sessions
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center">
                  <FiCheck className="w-4 h-4 mr-2 text-emerald-600" />
                  Status
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm  xl:table-cell">
                <div className="flex items-center">
                  <FiCalendar className="w-4 h-4 mr-2 text-emerald-600" />
                  Schedule
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {trainers.map((trainer, index) => (
                <motion.tr
                  key={trainer._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {trainer.user?.firstName} {trainer.user?.lastName}
                    </div>
                  </td>

                  <td className="py-3 px-4  md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {trainer.specializations?.slice(0, 2).map((spec) => (
                        <span
                          key={spec}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        >
                          {spec.replace(/_/g, " ")}
                        </span>
                      ))}
                      {trainer.specializations?.length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          +{trainer.specializations.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4  lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {trainer.isAvailableForNewClients ? (
                        <span className="text-emerald-700">Available</span>
                      ) : (
                        <span className="text-red-700">Not Available</span>
                      )}
                    </span>
                  </td>
                  <td className="py-3 px-4 lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {trainer.totalClients ?? 0} clients
                    </span>
                  </td>

                  {/* Active Clients - Green */}
                  <td className="py-3 px-4 lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {trainer.activeClients ?? 0} active
                    </span>
                  </td>

                  {/* Total Sessions - Purple */}
                  <td className="py-3 px-4 lg:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                      {trainer.totalSessions ?? 0} sessions
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <StatusBadge status={trainer.status} />
                    </div>
                  </td>
                  <td className="py-3 px-4  xl:table-cell">
                    <WorkSchedule schedule={trainer.workSchedule} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {/* view */}
                      <motion.button
                        onClick={() => handleView(trainer._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="View Trainer"
                      >
                        <FiEye className="w-3 h-3" />
                      </motion.button>
                      {/* edit */}
                      <motion.button
                        onClick={() => onEdit(trainer._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="Edit Trainer"
                      >
                        <FiEdit3 className="w-3 h-3" />
                      </motion.button>
                      {/* delete */}
                      <motion.button
                        onClick={() => onDelete(trainer._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="Delete Trainer"
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
            {pagination.totalRecords} total trainers
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
  );
};

export default TrainerTable;
