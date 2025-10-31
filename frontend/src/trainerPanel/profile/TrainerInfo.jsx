
import StatusBadge from "../../admin/dashboard/components/trainer/StatusBadge";
const TrainerInfo = ({ trainer }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Gender
        </span>
        <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
          {trainer.gender || "Not specified"}
        </span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Experience
        </span>
        <span className="text-sm text-gray-900 dark:text-gray-100">
          {trainer.experience} {trainer.experience === 1 ? "Year" : "Years"}
        </span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Status
        </span>
        <StatusBadge status={trainer.status} />
      </div>
      <div className="flex justify-between items-center py-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Client Availability
        </span>
        <span
          className={`text-sm font-medium ${
            trainer.isAvailableForNewClients
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trainer.isAvailableForNewClients ? "Available" : "Unavailable"}
        </span>
      </div>
    </div>
  );
};

export default TrainerInfo;
