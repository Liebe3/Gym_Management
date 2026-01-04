import { motion } from "framer-motion";
const SessionCard = ({ session, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
    >
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white">
          {session.member?.user?.firstName} {session.member?.user?.lastName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Trainer: {session.trainer?.user?.firstName}{" "}
          {session.trainer?.user?.lastName}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {new Date(session.date).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          from {session.startTime} to {session.endTime}
        </p>
      </div>
      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full px-3 py-1">
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
          Scheduled
        </p>
      </div>
    </motion.div>
  );
};

export default SessionCard;
