const WorkSchedule = ({ schedule }) => {
  if (!schedule || typeof schedule !== "object") return "Not set";

  const workingDays = Object.entries(schedule).filter(
    ([_, daySchedule]) => daySchedule?.isWorking
  );

  if (workingDays.length === 0) return "No working days";

  const [firstDayKey, firstDaySchedule] = workingDays[0];
  const formattedDay = firstDayKey.charAt(0).toUpperCase() + firstDayKey.slice(1);

  return (
    <div className="text-xs">
      <div className="font-medium">
        {formattedDay}: {firstDaySchedule.startTime} - {firstDaySchedule.endTime}
      </div>
      {workingDays.length > 1 && (
        <div className="text-gray-400 mt-1">
          +{workingDays.length - 1} more days
        </div>
      )}
    </div>
  );
};

export default WorkSchedule;
