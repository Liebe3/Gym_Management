const StatusBadge = ({
  formData,
  handleChange,
  errors,
  isViewMode,
  loading,
  selectedSession,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "completed":
        return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Status 
      </label>
      {isViewMode ? (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            selectedSession?.status
          )}`}
        >
          {selectedSession?.status || "N/A"}
        </span>
      ) : (
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
            errors.status ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )}
      {errors.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
    </div>
  );
};

export default StatusBadge;
