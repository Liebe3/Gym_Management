import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

const WorkScheduleInput = ({ value, onChange }) => {
  const handleWorkScheduleChange = (day, field, newValue) => {
    onChange({
      ...value,
      [day]: {
        ...value[day],
        [field]: newValue,
      },
    });
  };

  return (
    <div>
      <label className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
          <FiClock className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        Work Schedule
      </label>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {/* Schedule Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Object.entries(value).map(([day, schedule]) => {
            const isWeekend = ["saturday", "sunday"].includes(day);
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl border p-4 transition-all duration-200
                  ${
                    schedule.isWorking
                      ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 bg-gray-50 dark:bg-gray-800/40"
                  }
                  ${
                    isWeekend
                      ? "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-900"
                      : ""
                  }
                `}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 capitalize">
                    {day}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.isWorking}
                      onChange={(e) =>
                        handleWorkScheduleChange(
                          day,
                          "isWorking",
                          e.target.checked
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 peer-checked:bg-emerald-500 rounded-full relative transition">
                      <span className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5" />
                    </div>
                  </label>
                </div>

                {/* Active vs Inactive */}
                {schedule.isWorking ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {schedule.startTime || "00:00"} –{" "}
                      {schedule.endTime || "00:00"}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          Start
                        </label>
                        <input
                          type="time"
                          value={schedule.startTime}
                          onChange={(e) =>
                            handleWorkScheduleChange(
                              day,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="w-full text-sm border rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400">
                          End
                        </label>
                        <input
                          type="time"
                          value={schedule.endTime}
                          onChange={(e) =>
                            handleWorkScheduleChange(
                              day,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="w-full text-sm border rounded-lg px-2 py-1 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-500 italic">
                    Day Off
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkScheduleInput;
