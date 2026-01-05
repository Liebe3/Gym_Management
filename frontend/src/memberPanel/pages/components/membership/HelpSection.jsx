import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const HelpSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6"
    >
      <div className="flex items-start gap-4">
        <FiAlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 text-xl mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            Need Help Choosing?
          </h3>
          <p className="text-blue-700 dark:text-blue-400 text-sm">
            Contact our support team or speak with a trainer to find the perfect
            plan for your fitness goals and budget.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpSection;
