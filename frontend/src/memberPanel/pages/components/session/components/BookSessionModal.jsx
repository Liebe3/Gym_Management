import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import BookSessionForm from "../BookSessionForm";

const BookSessionModal = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Book a Session
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <BookSessionForm onSuccess={onSuccess} onClose={onClose} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookSessionModal;
