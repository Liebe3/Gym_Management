import { FiCheckCircle, FiClock, FiXCircle, FiMinusCircle } from "react-icons/fi";

const StatusBadge = ({ status, }) => {
  switch (status?.toLowerCase()) {
    case "active":
      return (
        <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
          <FiCheckCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Active</span>
        </div>
      );
    case "inactive":
      return (
        <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
          <FiXCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Inactive</span>
        </div>
      );
    case "on_leave":
      return (
        <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
          <FiClock className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">On Leave</span>
        </div>
      );
    case "terminated":
      return (
        <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
          <FiMinusCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Terminated</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
          <FiXCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Unknown</span>
        </div>
      );
  }
};

export default StatusBadge;