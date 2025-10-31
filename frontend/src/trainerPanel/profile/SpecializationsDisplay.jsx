import { motion } from "framer-motion";
const SpecializationsDisplay = ({ specializations }) => {
  if (!specializations?.length) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        No specializations listed
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {specializations.map((spec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 px-4 py-2 rounded-full text-sm font-medium"
        >
          {spec}
        </motion.div>
      ))}
    </div>
  );
};

export default SpecializationsDisplay;
