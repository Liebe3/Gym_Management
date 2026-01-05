import { FiAlertCircle } from "react-icons/fi";

const EmptyPlans = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
      <FiAlertCircle className="mx-auto text-5xl text-gray-400 dark:text-gray-600 mb-4" />
      <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
        No membership plans available
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Check back later for available plans
      </p>
    </div>
  );
};

export default EmptyPlans;