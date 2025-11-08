import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

const TrainerSessionModal = ({
  isModalOpen,
  mode,
  selectedSession,
  handleCloseModal,
  onSuccess,
  children,
}) => {
  if (!isModalOpen) return null;

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Schedule New Session";
      case "update":
        return "Update Session";
      case "view":
        return "Session Details";
      default:
        return "Session";
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl flex items-center justify-between">
                <h2 className="text-2xl font-bold text-emerald-600">
                  {getTitle()}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TrainerSessionModal;
