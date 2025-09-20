import { motion } from "framer-motion";
import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { showError } from "../../../../pages/utils/Alert";

const SpecializationsInput = ({ value = [], onChange }) => {
  const [newSpecialization, setNewSpecialization] = useState("");

  const handleAddSpecialization = () => {
    const trimmedSpecialization = newSpecialization.trim();

    if (!trimmedSpecialization) return;

    // validation
    if (trimmedSpecialization.length < 2) {
      showError("Specialization must be at least 2 characters long");
      return;
    }
    if (trimmedSpecialization.length > 50) {
      showError("Specialization must be less than 50 characters");
      return;
    }
    if (value.includes(trimmedSpecialization)) {
      showError("This specialization already exists");
      return;
    }

    onChange([...value, trimmedSpecialization]);
    setNewSpecialization("");
  };

  const handleRemoveSpecialization = (specializations) => {
    onChange(
      value.filter((specialization) => specialization !== specializations)
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSpecialization();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Specializations
      </label>

      {/* Add input */}
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={newSpecialization}
          onChange={(event) => setNewSpecialization(event.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter specialization (e.g., Yoga, Strength)"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
          maxLength={50}
        />
        <motion.button
          type="button"
          onClick={handleAddSpecialization}
          disabled={!newSpecialization.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition duration-200 disabled:cursor-not-allowed flex items-center cursor-pointer"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add
        </motion.button>
      </div>

      {/* Current list */}
      {value.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Current specializations ({value.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map((specializations, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full text-sm"
              >
                <span>{specializations}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpecialization(specializations)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 cursor-pointer"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          No specializations added yet. Add some to showcase trainer expertise.
        </p>
      )}
    </div>
  );
};

export default SpecializationsInput;
