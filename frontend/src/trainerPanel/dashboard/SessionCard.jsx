import { motion } from "framer-motion";

const SessionCard = ({ session, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-emerald-600"
  >
    <div className="flex-1">
      <p className="font-semibold text-gray-900 dark:text-white">
        {session.member?.user?.firstName} {session.member?.user?.lastName}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(session.date).toLocaleDateString()} • {session.startTime} -{" "}
        {session.endTime}
      </p>
    </div>
    <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg px-3 py-1">
      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
        Scheduled
      </span>
    </div>
  </motion.div>
);

export default SessionCard;
