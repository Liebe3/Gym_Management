const StatCard = ({
  title,
  value,
  icon,
  valueColor = "text-gray-900 dark:text-white",
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${valueColor}`}>
            {value || 0}
          </p>
        </div>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
