import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";

const TopTrainers = ({ trainers, onViewProfile, onBookSession }) => {
  if (!trainers || trainers.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No top trainers available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map((trainer, idx) => (
        <motion.div
          key={trainer._id}
          whileHover={{ y: -5 }}
          className="flex flex-col gap-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 dark:from-gray-700 to-gray-100 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          {/* Rank Badge and Trainer Info */}
          <div className="flex items-start gap-4">
            {/* Rank Badge */}
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  idx === 0
                    ? "bg-yellow-500"
                    : idx === 1
                    ? "bg-gray-400 dark:bg-gray-500"
                    : "bg-orange-600 dark:bg-orange-700"
                }`}
              >
                #{idx + 1}
              </div>
            </div>

            {/* Trainer Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {trainer.firstName} {trainer.lastName}
              </p>
              {trainer.specializations &&
                trainer.specializations.length > 0 && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {trainer.specializations.join(", ")}
                  </p>
                )}
              {trainer.experience && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {trainer.experience} yrs experience
                </p>
              )}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {trainer.sessionCount} sessions
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 pt-2 border-t border-gray-300 dark:border-gray-600">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onViewProfile?.(trainer)}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <FiUser className="w-3 h-3" />
              View Profile
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TopTrainers;
