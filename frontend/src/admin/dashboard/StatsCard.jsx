import { motion } from "framer-motion";
const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      value: "text-blue-600 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      value: "text-green-600 dark:text-green-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      value: "text-purple-600 dark:text-purple-400",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      value: "text-emerald-600 dark:text-emerald-400",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      value: "text-orange-600 dark:text-orange-400",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
      value: "text-red-600 dark:text-red-400",
    },
    pink: {
      bg: "bg-pink-100 dark:bg-pink-900/30",
      text: "text-pink-600 dark:text-pink-400",
      value: "text-pink-600 dark:text-pink-400",
    },
  };

  const colors = colorClasses[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className={`text-3xl font-bold ${colors.value}`}>
            {typeof value === "number" && value > 999
              ? `₱${(value / 1000).toFixed(1)}K`
              : value}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}
        >
          {Icon && <Icon className={`w-6 h-6 ${colors.text}`} />}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
