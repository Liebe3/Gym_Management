//libraries
import { motion } from "framer-motion";

function Loading() {
  const dotVariants = {
    pulse: {
      scale: [1, 1.5, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0d1117] dark:text-[#f0f6fc] flex items-center justify-center px-4">
      <motion.div
        animate="pulse"
        transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
        className="container"
      >
        <motion.div className="dot" variants={dotVariants} />
        <motion.div className="dot" variants={dotVariants} />
        <motion.div className="dot" variants={dotVariants} />
        <StyleSheet />
      </motion.div>
    </div>
  );
}

/**
 * ==============   Styles   ================
 */
function StyleSheet() {
  return (
    <style>
      {`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
        }

        .dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: #2563EB;
          will-change: transform;
        }
      `}
    </style>
  );
}

export default Loading;
