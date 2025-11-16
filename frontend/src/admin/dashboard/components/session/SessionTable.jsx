import { AnimatePresence, motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiEye,
  FiFilter,
  FiPlus,
  FiTrash2,
  FiUser,
  FiCheck
} from "react-icons/fi";

const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

import { MdGroups } from "react-icons/md";
import CreateScheduleButtons from "../ui/CreateScheduleButton";

const SessionTable = ({
  sessions = [],
  onEdit,
  onDelete,
  onView,
  handleOpenCreate,
  hasActiveFilters,
  clearFilters,
  pagination = {},
  currentPage,
  setCurrentPage,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "completed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getTrainerName = (trainer) => {
    if (!trainer || !trainer.user) return "N/A";
    return `${trainer.user.firstName} ${trainer.user.lastName}`;
  };

  const getMemberName = (member) => {
    if (!member || !member.user) return "N/A";
    return `${member.user.firstName} ${member.user.lastName}`;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (sessions.length === 0) {
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
            <FiCalendar className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {hasActiveFilters ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No sessions match your filters
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              Try adjusting your filter criteria
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
              No sessions available.
            </p>
            <CreateScheduleButtons onClick={handleOpenCreate}>
              <div className="flex items-center">
                <FiPlus className="w-4 h-4 mr-2" />
                Schedule Your First Session
              </div>
            </CreateScheduleButtons>
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
      {/* Header with Create Button */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <CreateScheduleButtons onClick={handleOpenCreate}>
          <div className="flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Create New Session
          </div>
        </CreateScheduleButtons>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center whitespace-nowrap">
                  <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                  Trainer
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center whitespace-nowrap">
                  <MdGroups className="w-4 h-4 mr-2 text-emerald-600" />
                  Member
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center whitespace-nowrap">
                  <FiCalendar className="w-4 h-4 mr-2 text-emerald-600" />
                  Date
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center justify-start whitespace-nowrap">
                  <FiClock className="w-4 h-4 mr-2 text-emerald-600" />
                  Start Time
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                <div className="flex items-center justify-start whitespace-nowrap">
                  <FiClock className="w-4 h-4 mr-2 text-emerald-600" />
                  End Time
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm min-w-[120px]">
                <div className="flex items-center justify-start whitespace-nowrap">
                  <FiCheck className="w-4 h-4 mr-2 text-emerald-600" />
                  Status
                </div>
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm w-1/8">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {sessions.map((session, index) => (
                <motion.tr
                  key={session._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {getTrainerName(session.trainer)}
                    </div>
                    {session.trainer?.user?.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {session.trainer.user.email}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                      {getMemberName(session.member)}
                    </div>
                    {session.member?.user?.email && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {session.member.user.email}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                      {new Date(session.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white whitespace-nowrap">
                      <div className="w-4 mr-2" />
                      {formatTime(session.startTime) || "N/A"}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white whitespace-nowrap">
                      <div className="w-4 mr-2" />
                      {formatTime(session.endTime) || "N/A"}
                    </div>
                  </td>

                  <td className="py-3 px-4 min-w-[120px]">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium w-24 ${getStatusColor(
                          session.status
                        )}`}
                      >
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1">
                      {/* View Button */}
                      <motion.button
                        onClick={() => onView(session)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="View Session"
                      >
                        <FiEye className="w-3 h-3" />
                      </motion.button>

                      {/* Edit Button */}
                      <motion.button
                        onClick={() => onEdit(session)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="Edit Session"
                      >
                        <FiEdit2 className="w-3 h-3" />
                      </motion.button>

                      {/* Delete Button */}
                      <motion.button
                        onClick={() => onDelete(session._id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="Delete Session"
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
            Page {currentPage} of {pagination.totalPages} — {pagination.total}{" "}
            total sessions
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage !== 1
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
                  onClick={() => handlePageChange(page)}
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
              disabled={currentPage === pagination.totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage !== pagination.totalPages
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

export default SessionTable;
