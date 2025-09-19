import { FiCalendar } from "react-icons/fi";

const TrainerAvailability = ({ value, onChange, disabled }) => {
  const displayValue = value ? "available" : "unavailable";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 mr-1 text-emerald-600" />
          Availability
        </div>
      </label>

      {disabled ? (
        <div className="w-fit min-w-[160px] rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm shadow-sm cursor-not-allowed">
          {displayValue.charAt(0).toUpperCase() + displayValue.slice(1)}
        </div>
      ) : (
        <select
          value={displayValue}
          onChange={(event) => onChange(event.target.value === "available")}
          className="w-fit min-w-[160px] rounded-lg p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white text-sm shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="">Select</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      )}
    </div>
  );
};

export default TrainerAvailability;
