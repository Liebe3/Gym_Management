// src/utils/sessionStatus.js

export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED_BY_MEMBER: "cancelled_by_member",
  CANCELLED_BY_TRAINER: "cancelled_by_trainer",
  CANCELLED_BY_ADMIN: "cancelled_by_admin",
};

/*
  Returns formatted label for a session status
 */
export const formatSessionStatus = (status) => {
  switch (status) {
    case SESSION_STATUS.SCHEDULED:
      return "Scheduled";

    case SESSION_STATUS.COMPLETED:
      return "Completed";

    case SESSION_STATUS.CANCELLED_BY_ADMIN:
      return "Cancelled by Admin";

    case SESSION_STATUS.CANCELLED_BY_TRAINER:
      return "Cancelled by You";

    case SESSION_STATUS.CANCELLED_BY_MEMBER:
      return "Cancelled by Member";

    default:
      if (!status) return "N/A";
      return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

/*
  Returns Tailwind classes for a session status
 */
export const getSessionStatusColor = (status) => {
  switch (status) {
    case SESSION_STATUS.SCHEDULED:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";

    case SESSION_STATUS.COMPLETED:
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

    case SESSION_STATUS.CANCELLED_BY_TRAINER:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

    case SESSION_STATUS.CANCELLED_BY_MEMBER:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";

    case SESSION_STATUS.CANCELLED_BY_ADMIN:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";

    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};
