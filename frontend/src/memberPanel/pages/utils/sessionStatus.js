// src/utils/sessionStatus.js

export const SESSION_STATUS = {
  SCHEDULED: "scheduled",
  COMPLETED: "completed",
  CANCELLED_BY_MEMBER: "cancelled_by_member",
  CANCELLED_BY_TRAINER: "cancelled_by_trainer",
  CANCELLED_BY_ADMIN: "cancelled_by_admin",
};

export const AdminformatSessionStatus = (status) => {
  switch (status) {
    case SESSION_STATUS.SCHEDULED:
      return "Scheduled";

    case SESSION_STATUS.COMPLETED:
      return "Completed";

    case SESSION_STATUS.CANCELLED_BY_ADMIN:
      return "Cancelled by you";

    case SESSION_STATUS.CANCELLED_BY_TRAINER:
      return "Cancelled by Trainer";

    case SESSION_STATUS.CANCELLED_BY_MEMBER:
      return "Cancelled by Member";

    default:
      if (!status) return "N/A";
      return status
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
};

export const AdmingetSessionStatusColor = (status) => {
  switch (status) {
    case SESSION_STATUS.SCHEDULED:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";

    case SESSION_STATUS.COMPLETED:
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";

    case SESSION_STATUS.CANCELLED_BY_TRAINER:
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";

    case SESSION_STATUS.CANCELLED_BY_MEMBER:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";

    case SESSION_STATUS.CANCELLED_BY_ADMIN:
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";

    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

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

export const getStatusColor = (status) => {
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

export const getMemberStatusBadge = (status) => {
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
