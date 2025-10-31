import { motion } from "framer-motion";

const TrainerInfoCard = ({ icon: Icon, title, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg mr-3">
          <Icon className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
      </div>
      {children}
    </motion.div>
  );
};

export default TrainerInfoCard;
