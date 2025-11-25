import { FiClock } from "react-icons/fi";
import { formatDateTime, formatTimeAMPM } from "../utils/formatTime";

const UpcomingSessions = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No upcoming sessions scheduled
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, idx) => (
        <div
          key={idx}
          className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          <FiClock className="text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5 text-lg" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatDateTime(session.date)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatTimeAMPM(session.startTime)} -{" "}
              {formatTimeAMPM(session.endTime)} •{" "}
              {session.trainer?.user?.firstName}{" "}
              {session.trainer?.user?.lastName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingSessions;
