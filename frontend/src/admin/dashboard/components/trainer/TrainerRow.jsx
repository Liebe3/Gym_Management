import { motion } from "framer-motion";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import WorkSchedule from "./WorkSchedule";

const TrainerRow = ({ trainer, index }) => (
  <motion.tr
    key={trainer._id}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
  >
    <td className="py-3 px-4">
      <div className="font-semibold text-gray-900 dark:text-white">
        {trainer.user?.firstName}
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="font-semibold text-gray-900 dark:text-white">
        {trainer.user?.lastName}
      </div>
    </td>
    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
      {trainer.user?.email}
    </td>
    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
      {trainer.specializations?.slice(0, 2).map((specialization, index) => (
        <span
          key={index}
          className="inline-block mr-1 mb-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded text-xs"
        >
          {specialization}
        </span>
      ))}
      {trainer.specializations?.length > 2 && (
        <span className="text-gray-400 text-xs">
          +{trainer.specializations.length - 2} more
        </span>
      )}
    </td>
    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
      {trainer.rating ? `${trainer.rating.toFixed(1)} ⭐` : "No rating"}
    </td>
    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
      {trainer.totalClients || 0}
    </td>
    <td className="py-3 px-4">
      <StatusBadge status={trainer.status} />
    </td>
    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 hidden xl:table-cell">
      <WorkSchedule schedule={trainer.workSchedule} />
    </td>
    <td className="py-3 px-4">
      <div className="flex items-center space-x-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg shadow-sm"
          title="Edit"
        >
          <FiEdit3 className="w-3 h-3" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-sm"
          title="Delete"
        >
          <FiTrash2 className="w-3 h-3" />
        </motion.button>
      </div>
    </td>
  </motion.tr>
);

export default TrainerRow;
