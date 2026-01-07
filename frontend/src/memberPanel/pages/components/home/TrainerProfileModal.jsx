import { motion } from "framer-motion";

import { FiX } from "react-icons/fi";
const TrainerProfileModal = ({ trainer, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close Button */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">Trainer Information</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Trainer Name */}
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {trainer.firstName} {trainer.lastName}
          </h3>

          {/* Status */}
          <div className="flex gap-2 mb-4">
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                trainer.status === "active"
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
              }`}
            >
              {trainer.status === "active" ? "Active" : trainer.status}
            </span>
            {/* Availability Badge */}
            {trainer.isAvailableForNewClients && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                Available
              </span>
            )}

            {!trainer.isAvailableForNewClients && (
              <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                Unavailable
              </span>
            )}
          </div>

          {/* Specializations */}
          {trainer.specializations && trainer.specializations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Specializations
              </h4>
              <div className="flex gap-2 flex-wrap">
                {trainer.specializations.map((spec, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {trainer.experience && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Experience
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                {trainer.experience} years
              </p>
            </div>
          )}

          {/* Schedule */}
          {trainer.workSchedule && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Work Schedule
              </h4>
              <div className="space-y-2">
                {Object.entries(trainer.workSchedule).map(([day, schedule]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                      {day}
                    </span>
                    {schedule.isWorking ? (
                      <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Off
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              onClick={onClose}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrainerProfileModal;
