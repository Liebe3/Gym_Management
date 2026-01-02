import { motion } from "framer-motion";
import { useState } from "react";
import { FiCalendar, FiClock, FiPlus, FiUser } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";

import { formatDate, formatTimeAMPM } from "../../utils/formatTime";

import CancelSessionModal from "./components/CancelSessionModal";
import ViewUpcomingSessionModal from "./components/VIewUpcomingSessionModal";

const MemberTableSession = ({
  sessions = [],
  onBookSession,
  pagination = {},
  currentPage,
  setCurrentPage,
  onSessionsUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleViewSession = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancelSession = (session) => {
    setSelectedSession(session);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedSession(null);
  };

  const handleCancellationSuccess = () => {
    setIsCancelModalOpen(false);
    setSelectedSession(null);
    if (onSessionsUpdated) {
      onSessionsUpdated();
    }
  };

  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <MdFitnessCenter className="w-8 h-8 text-gray-400" />
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
          No sessions available yet.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBookSession}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer inline-flex items-center"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Book Your First Session
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onBookSession}
          className="px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer hover:bg-emerald-700 transition-colors"
        >
          <div className="flex items-center">
            <FiPlus className="w-4 h-4 mr-2" />
            Book Session
          </div>
        </button>
      </div>

      {/* Scrollable container */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-[800px] w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Trainer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Specializations
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Notes
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session, index) => (
              <motion.tr
                key={session._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-emerald-600" />
                    {formatDate(session.date)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-emerald-600" />
                    {formatTimeAMPM(session.startTime)} -{" "}
                    {formatTimeAMPM(session.endTime)}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-emerald-600" />
                    {session.trainer?.user
                      ? `${session.trainer.user.firstName} ${session.trainer.user.lastName}`
                      : "Not assigned"}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {session.trainer?.specializations &&
                    session.trainer.specializations.length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs">
                          {session.trainer.specializations[0][0].toUpperCase() +
                            session.trainer.specializations[0].slice(1)}
                        </span>
                        {session.trainer.specializations.length > 1 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{session.trainer.specializations.length - 1} more
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No specializations
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                  {session.notes ? (
                    <span>{session.notes}</span>
                  ) : (
                    <span className="text-gray-400 italic">No notes</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                    {session.status || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewSession(session)}
                      className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium cursor-pointer transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleCancelSession(session)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages} —{" "}
            {pagination.totalRecords} total sessions
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

      {/* View Session Modal */}
      <ViewUpcomingSessionModal
        isModalOpen={isModalOpen}
        session={selectedSession}
        handleCloseModal={handleCloseModal}
      />

      {/* Cancel Session Modal */}
      <CancelSessionModal
        isModalOpen={isCancelModalOpen}
        session={selectedSession}
        handleCloseModal={handleCloseCancelModal}
        onSuccess={handleCancellationSuccess}
      />
    </motion.div>
  );
};

export default MemberTableSession;
