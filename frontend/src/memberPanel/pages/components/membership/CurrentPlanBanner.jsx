import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";
import { FaIdCard } from "react-icons/fa";

const CurrentPlanBanner = ({ currentPlan }) => {
  const calculatePricePerMonth = (price, duration, durationType) => {
    const daysInMonth = 30;
    let totalDays;

    switch (durationType) {
      case "days":
        totalDays = duration;
        break;
      case "weeks":
        totalDays = duration * 7;
        break;
      case "months":
        totalDays = duration * daysInMonth;
        break;
      case "years":
        totalDays = duration * 365;
        break;
      default:
        totalDays = duration * daysInMonth;
    }

    return Math.round((price / totalDays) * daysInMonth * 100) / 100;
  };

  const pricePerMonth = calculatePricePerMonth(
    currentPlan.price,
    currentPlan.duration,
    currentPlan.durationType
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-lg shadow-lg p-6 mb-8 text-white"
    >
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FaIdCard className="text-2xl" />
            <h2 className="text-2xl font-bold">Your Current Plan</h2>
          </div>
          <p className="text-emerald-50 font-bold text-lg mb-4">{currentPlan.name}</p>

          {currentPlan.description && (
            <p className="text-emerald-100 text-sm max-w-2xl">
              {currentPlan.description}
            </p>
          )}
        </div>

        <div className="text-right">
          <p className="text-emerald-100 text-sm mb-1">Price</p>
          <p className="text-4xl font-bold">₱{currentPlan.price}</p>
          <p className="text-emerald-100 text-sm mt-1">
            per {currentPlan.duration} {currentPlan.durationType}
          </p>
          <div className="flex items-center justify-end gap-1 text-emerald-200 text-xs mt-2">
            <FiTrendingUp className="text-xs" />
            <span>~₱{pricePerMonth}/month</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentPlanBanner;