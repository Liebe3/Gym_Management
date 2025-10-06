import { useEffect, useState } from "react";
import trainerService from "../../../../services/trainerService";

const TrainerSelect = ({ value, onChange, disabled }) => {
  const [trainers, setTrainers] = useState([]);
  const [trainersLoading, setTrainersLoading] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setTrainersLoading(true);
        const response = await trainerService.getAllTrainer({
          status: "active",
          availability: true, // only available and active trainers
          all: true,
          // limit: 1000, // backup to fetch more if needed
        });

        const trainerLists = response?.data || [];
        setTrainers(trainerLists);
      } catch (error) {
        console.error("Error fetching trainers", error);
      } finally {
        setTrainersLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Assign Trainer
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 overflow-y-auto ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400"
            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
        }`}
      >
        <option value="">Select a trainer</option>
        {trainers.map((trainer) => (
          <option key={trainer._id} value={trainer._id}>
            {trainer.user?.firstName} {trainer.user?.lastName}
            {trainer.specializations?.length > 0 &&
              ` (${trainer.specializations[0]})`}
          </option>
        ))}
      </select>
      {!trainersLoading && trainers.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          No trainers found
        </p>
      )}
    </div>
  );
};

export default TrainerSelect;
