import { FiCheckCircle, FiXCircle, FiZap } from "react-icons/fi";
import { formatDateTime, formatTimeAMPM } from "../../utils/formatTime";
import {
  MemberformatSessionStatus,
  MembergetSessionStatusColor,
} from "../../utils/sessionStatus";

const getStatusIcon = (status) => {
  if (status === "completed") {
    return (
      <FiCheckCircle className="text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 text-lg" />
    );
  }
  if (status.includes("cancelled")) {
    return (
      <FiXCircle className="text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5 text-lg" />
    );
  }
  return (
    <FiZap className="text-yellow-500 dark:text-yellow-400 flex-shrink-0 mt-0.5 text-lg" />
  );
};

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
      {sessions.map((session, idx) => {
        const statusLabel = MemberformatSessionStatus(session.status);
        const statusColor = MembergetSessionStatusColor(session.status);
        return (
          <div
            key={idx}
            className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-lg transition-shadow"
          >
            {getStatusIcon(session.status)}

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
                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentSession;
