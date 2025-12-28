import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";

import { formatDate, formatTimeAMPM } from "../../utils/formatTime";

const MemberTableSession = ({ sessions = [] }) => {
  if (sessions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
      >
        <MdFitnessCenter className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No sessions found
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Try adjusting your filters or search criteria
        </p>
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
                    <button className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium">
                      Cancel
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MemberTableSession;
