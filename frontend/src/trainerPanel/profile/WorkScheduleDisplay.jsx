// Format time helper
const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};


const WorkScheduleDisplay = ({ schedule }) => {
  if (!schedule)
    return <p className="text-sm text-gray-500 italic">No schedule set</p>;
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {days.map((day) => {
        const s = schedule[day];
        if (!s) return null;
        return (
          <div
            key={day}
            className={`rounded-lg border p-3 ${
              s.isWorking
                ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-gray-200 bg-gray-50 dark:bg-gray-800/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                {day}
              </h4>
              {s.isWorking ? (
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  {formatTime(s.startTime)} - {formatTime(s.endTime)}
                </span>
              ) : (
                <span className="text-xs text-gray-500 italic">Day Off</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkScheduleDisplay;
