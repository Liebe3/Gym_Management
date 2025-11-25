import { FiCheckCircle, FiZap } from "react-icons/fi";
import { formatDateTime, formatTimeAMPM } from "../utils/formatTime";

const RecentSession = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No recent sessions
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
          {session.status === "completed" ? (
            <FiCheckCircle className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 text-lg" />
          ) : (
            <FiZap className="text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5 text-lg" />
          )}

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white">
              {formatDateTime(session.date)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatTimeAMPM(session.startTime)} -{" "}
              {formatTimeAMPM(session.endTime)}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  session.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {session.status.charAt(0).toUpperCase() +
                  session.status.slice(1)}
              </span>
              {session.intensity && (
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {session.intensity}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentSession;
