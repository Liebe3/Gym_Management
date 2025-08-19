import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit3,
  FiTrash2,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiStar,
  FiLoader,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";
import membershipPlanService from "../../../services/membershipPlansService";
import PlanButton from "./ui/PlanButton";
import CreatePlanModal from "./ui/MemberShipPlanModal";

const MembershipPlansSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create");

  // Fetch membership plans
  const loadMembershipPlans = async () => {
    try {
      setLoading(true);
      const response = await membershipPlanService.getAllPlans();
      setPlans(response.plans || []);
    } catch (err) {
      console.error("Error fetching membership plans:", err);
      setError("Failed to fetch membership plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembershipPlans();
  }, []);

  // Display features
  const displayFeatures = (features) => {
    if (!features || features.length === 0) return "No features listed";
    return Array.isArray(features) ? features.join(", ") : features;
  };

  // Open modal for creating plan
  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setMode("create");
    setIsModalOpen(true);
  };

  // Open modal for editing plan
  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setMode("update");
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setMode("create");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mr-3"
        >
          <FiLoader className="w-6 h-6 text-emerald-600" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading membership plans...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </motion.div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">
            Membership Plans
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize your subscription plans
          </p>
        </motion.div>

        {/* No plans */}
        {plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FiStar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No membership plans available.
            </p>
            <PlanButton onClick={handleOpenCreate}>
              <div className="flex items-center">
                <FiPlus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </div>
            </PlanButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Create Plan Button */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <PlanButton onClick={handleOpenCreate}>
                <div className="flex items-center">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create New Plan
                </div>
              </PlanButton>
            </div>

            {/* Plans Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 mr-2 text-emerald-600" />
                        Plan Name
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden md:table-cell">
                      Description
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 mr-2 text-emerald-600" />
                        Price
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden lg:table-cell">
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-emerald-600" />
                        Duration
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden xl:table-cell">
                      Features
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {plans.map((plan, index) => (
                      <motion.tr
                        key={plan._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {plan.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 md:hidden">
                            {plan.description}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <div className="text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {plan.description}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full font-semibold text-xs">
                              ${plan.price}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <FiClock className="w-3 h-3 mr-1 text-emerald-600" />
                            {plan.duration} {plan.durationType}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden xl:table-cell">
                          <div className="text-gray-600 dark:text-gray-400 max-w-xs truncate text-sm">
                            {displayFeatures(plan.features)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {plan.status === "active" ? (
                              <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                                <FiXCircle className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">
                                  Inactive
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <motion.button
                              onClick={() => handleEditPlan(plan)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm"
                              title="Edit Plan"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm"
                              title="Delete Plan"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Modal */}
        <CreatePlanModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          mode={mode}
          selectedPlan={selectedPlan}
          onSuccess={() => {
            setIsModalOpen(false);
            loadMembershipPlans();
          }}
        />
      </div>
    </div>
  );
};

export default MembershipPlansSection;
