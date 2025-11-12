import { FiUser } from "react-icons/fi";

const TrainerSelect = ({
  isViewMode,
  trainers,
  formData,
  handleChange,
  errors,
  loading,
  selectedSession,
  mode,
}) => {
  const getTrainerName = (trainer) =>
    trainer?.user
      ? `${trainer.user.firstName} ${trainer.user.lastName}`
      : "Unknown Trainer";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Trainer <span className="text-red-500">*</span>
      </label>

      {isViewMode ? (
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <FiUser className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-800 dark:text-gray-200">
            {selectedSession?.trainer
              ? getTrainerName(selectedSession.trainer)
              : trainers.find((t) => t._id === formData.trainerId)
              ? getTrainerName(
                  trainers.find((t) => t._id === formData.trainerId)
                )
              : "N/A"}
          </span>
        </div>
      ) : (
        <select
          name="trainerId"
          value={formData.trainerId}
          onChange={handleChange}
          disabled={loading || mode === "update"}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
            errors.trainerId
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Select a trainer</option>
          {trainers.map((t) => (
            <option key={t._id} value={t._id}>
              {getTrainerName(t)}
            </option>
          ))}
        </select>
      )}

      {errors.trainerId && (
        <p className="mt-1 text-sm text-red-500">{errors.trainerId}</p>
      )}
    </div>
  );
};

export default TrainerSelect;
