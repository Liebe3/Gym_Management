import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import trainerService from "../../../../services/trainerService";

const TrainerSelect = ({
  value = [],
  onChange,
  disabled,
  primaryTrainerId,
  onPrimaryChange,
}) => {
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setTrainersLoading(true);
        const response = await trainerService.getAllTrainer({
          status: "active",
          availability: true,
          all: true,
        });

        setTrainers(response?.data || []);
      } catch (error) {
        console.error("Error fetching trainers", error);
      } finally {
        setTrainersLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const handleAddTrainer = (trainerId) => {
    if (!value.includes(trainerId)) {
      const newValue = [...value, trainerId];
      onChange(newValue);

      // Set as primary if it's the first trainer
      if (value.length === 0) {
        onPrimaryChange?.(trainerId);
      }
    }
  };

  const handleRemoveTrainer = (trainerId) => {
    const newValue = value.filter((id) => id !== trainerId);
    onChange(newValue);

    // Reset primary if removed trainer was primary
    if (primaryTrainerId === trainerId && newValue.length > 0) {
      onPrimaryChange?.(newValue[0]);
    } else if (newValue.length === 0) {
      onPrimaryChange?.(null);
    }
  };

  const getTrainerName = (trainerId) => {
    const trainer = trainers.find((t) => t._id === trainerId);
    return trainer
      ? `${trainer.user.firstName} ${trainer.user.lastName}`
      : "Unknown";
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
          Assign Trainers
        </label>
        <select
          onChange={(e) => handleAddTrainer(e.target.value)}
          disabled={disabled || trainersLoading}
          className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white ${
            disabled
              ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900"
              : "bg-white dark:bg-gray-900 cursor-pointer"
          }`}
          defaultValue=""
        >
          <option value="">+ Add a trainer</option>
          {trainers
            .filter((t) => !value.includes(t._id))
            .map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.user?.firstName} {trainer.user?.lastName}
                {trainer.specializations?.length > 0 &&
                  ` (${trainer.specializations[0]})`}
              </option>
            ))}
        </select>
      </div>

      {/* Selected Trainers */}
      {value.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
            Selected Trainers ({value.length})
          </label>
          <div className="space-y-2">
            {value.map((trainerId) => (
              <div
                key={trainerId}
                className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
              >
                <div className="flex items-center flex-1">
                  <input
                    type="radio"
                    name="primaryTrainer"
                    checked={primaryTrainerId === trainerId}
                    onChange={() => onPrimaryChange?.(trainerId)}
                    disabled={disabled}
                    className="mr-3 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {getTrainerName(trainerId)}
                    {primaryTrainerId === trainerId && (
                      <span className="ml-2 text-xs px-2 py-1 bg-emerald-600 text-white rounded">
                        Primary
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTrainer(trainerId)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!trainersLoading && trainers.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No trainers found
        </p>
      )}
    </div>
  );
};

export default TrainerSelect;
