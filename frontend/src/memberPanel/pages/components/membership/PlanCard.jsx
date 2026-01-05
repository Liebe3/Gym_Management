import { motion } from "framer-motion";
import {
  FiCheck,
  FiCheckCircle,
  FiCreditCard,
  FiTrendingUp,
} from "react-icons/fi";

import { ShowInfo } from "../../../../pages/utils/Alert";

const PlanCard = ({ plan, isCurrent, index }) => {
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
    plan.price,
    plan.duration,
    plan.durationType
  );

	const handleSelectPlan = () => {
		ShowInfo("Contact the admin to change your membership plan.");
	}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
        isCurrent
          ? "border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-800"
          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600"
      }`}
    >
      {/* Current Plan Badge */}
      {isCurrent && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
          <FiCheckCircle className="text-sm" />
          CURRENT PLAN
        </div>
      )}

      <div className="p-6">
        {/* Plan Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {plan.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              ₱{plan.price}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              / {plan.duration} {plan.durationType}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FiTrendingUp className="text-xs" />
            <span>~₱{pricePerMonth}/month</span>
          </div>
        </div>

        {/* Description */}
        {plan.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            {plan.description}
          </p>
        )}

        {/* Features */}
        {plan.features && plan.features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              Features
            </h4>
            <ul className="space-y-2">
              {plan.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <FiCheck className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            isCurrent
              ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:scale-105 cursor-pointer"
          }`}
          disabled={isCurrent}
					onClick={handleSelectPlan}
        >
          <FiCreditCard />
          {isCurrent ? "Current Plan" : "Select Plan"}
        </button>
      </div>
    </motion.div>
  );
};

export default PlanCard;
