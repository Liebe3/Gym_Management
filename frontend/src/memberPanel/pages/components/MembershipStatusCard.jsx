import { formatDate } from "../utils/formatTime";

const MembershipStatusCard = ({ status }) => {
  if (!status) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300";
      case "expired":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300";
      case "pending":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300";
      case "expired":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div
      className={`rounded-lg border p-4 mb-8 ${getStatusColor(status.status)}`}
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(
              status.status
            )}`}
          >
            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
          </span>
          <div>
            {status.isExpired ? (
              <p className="font-semibold">Your membership has expired</p>
            ) : (
              <p className="font-semibold">
                {status.daysRemaining} days remaining
              </p>
            )}
            {status.expiresAt && !status.isExpired && (
              <p className="text-sm opacity-75 dark:opacity-60">
                Expires on {formatDate(status.expiresAt)}
              </p>
            )}
          </div>
        </div>
        {/* {status.autoRenew && (
          <span className="text-xs font-semibold bg-white dark:bg-gray-700 bg-opacity-40 dark:bg-opacity-60 px-2 py-1 rounded">
            Auto-renew enabled
          </span>
        )} */}
      </div>
    </div>
  );
};

export default MembershipStatusCard;
