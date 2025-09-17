import { motion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const CreateTrainerButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg transition-colors duration-200"
    >
      <FiPlus className="w-5 h-5 mr-2" />
      Create Trainer
    </motion.button>
  );
};

export default CreateTrainerButton;
