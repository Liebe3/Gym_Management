// 12-hour format with AM/PM
const formatTime = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const WorkSchedule = ({ schedule }) => {
  if (!schedule || typeof schedule !== "object") {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">Not set</div>
    );
  }

  const workingDays = Object.entries(schedule).filter(
    ([_, daySchedule]) => daySchedule?.isWorking === true
  );

  if (workingDays.length === 0) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400">
        No working days
      </div>
    );
  }

  const [firstDayKey, firstDaySchedule] = workingDays[0];
  const formattedDay =
    firstDayKey.charAt(0).toUpperCase() + firstDayKey.slice(1);

  return (
    <div className="text-xs">
      <div className="font-medium text-gray-700 dark:text-gray-300">
        {formattedDay}:{formatTime(firstDaySchedule.startTime)} -
        {formatTime(firstDaySchedule.endTime)}
      </div>
      {workingDays.length > 1 && (
        <div className="text-gray-400 dark:text-gray-500 mt-1">
          +{workingDays.length - 1} more days
        </div>
      )}
    </div>
  );
};

export default WorkSchedule;
