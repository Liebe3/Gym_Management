import { FiCalendar, FiClock } from "react-icons/fi";

const DateTimeInput = ({
  formData,
  handleChange,
  errors,
  isViewMode,
  loading,
  selectedSession,
}) => {


  // 12 hour time formatter
  const formatTime12Hour = (time) => {
    if (!time) return "N/A";
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Session Date <span className="text-red-500">*</span>
        </label>
        {isViewMode ? (
          <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <FiCalendar className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-800 dark:text-gray-200">
              {selectedSession?.date
                ? new Date(selectedSession.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        ) : (
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
              errors.date
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        )}
        {errors.date && (
          <p className="mt-1 text-sm text-red-500">{errors.date}</p>
        )}
      </div>

      {/* Time Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Start Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Time <span className="text-red-500">*</span>
          </label>
          {isViewMode ? (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <FiClock className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800 dark:text-gray-200">
                {formatTime12Hour(selectedSession?.startTime)}
              </span>
            </div>
          ) : (
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                errors.startTime
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          )}
          {errors.startTime && (
            <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
          )}
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Time <span className="text-red-500">*</span>
          </label>
          {isViewMode ? (
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <FiClock className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-gray-800 dark:text-gray-200">
                {formatTime12Hour(selectedSession?.endTime)}
              </span>
            </div>
          ) : (
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                errors.endTime
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          )}
          {errors.endTime && (
            <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateTimeInput;
