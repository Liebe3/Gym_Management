import { FiUser } from "react-icons/fi";

const TrainerCard = ({ trainer }) => {
  if (!trainer) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Your Trainer
          </p>
          <p className="text-lg font-bold text-pink-600 dark:text-pink-600 mt-2">
            {trainer.user?.firstName} {trainer.user?.lastName}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-block bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-xs font-semibold px-3 py-1 rounded-full">
              {trainer.specializations}
            </span>
          </div>
        </div>
        <FiUser className="text-pink-600 dark:text-pink-600 text-4xl" />
      </div>
    </div>
  );
};

export default TrainerCard;
