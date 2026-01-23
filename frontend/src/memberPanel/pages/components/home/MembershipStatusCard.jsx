import { formatDate } from "../../utils/formatTime";
import {
  getMemberStatusBadge,
  getStatusColor,
} from "../../utils/sessionStatus";

const MembershipStatusCard = ({ status }) => {
  if (!status) return null;

  return (
    <div className={`rounded-lg border p-6 ${getStatusColor(status.status)}`}>
      <div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getMemberStatusBadge(
              status.status,
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
      </div>
    </div>
  );
};

export default MembershipStatusCard;
