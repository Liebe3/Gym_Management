import { motion } from "framer-motion";
import { MdChevronRight } from "react-icons/md";

const MemberHeader = ({ title, breadcrumbs = [] }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-6 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <motion.div
            className="flex items-center space-x-3 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center space-x-3">
                {index > 0 && (
                  <MdChevronRight
                    className="text-gray-400 dark:text-gray-600"
                    size={20}
                  />
                )}
                <motion.button
                  onClick={crumb.onClick}
                  className={`text-base font-medium transition-all duration-200 ${
                    crumb.active
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {crumb.label}
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Title Section */}
        {title && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MemberHeader;
