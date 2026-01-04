
import { motion } from "framer-motion";
const TrainerCard = ({ trainer, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">
          {trainer.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {trainer.trainer?.user?.email}
        </p>
      </div>
      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-3 py-1">
        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {trainer.sessionCount} sessions
        </p>
      </div>
    </motion.div>
  );
};

export default TrainerCard;
