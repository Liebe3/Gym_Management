import { motion } from "framer-motion";
import { useState } from "react";
import { FiArrowLeft, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import sessionService from "../../services/sessionService";
import TrainerSessionForm from "./TrainerSessionForm";

const TrainerSessionCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreateSession = async (sessionData) => {
    setLoading(true);
    try {
      const response = await sessionService.createMySession(sessionData);
      if (response.success) {
        showSuccess("Session scheduled successfully");
        navigate("/trainer/sessions");
      }
    } catch (error) {
      console.error("Create session error:", error);
      showError(error.response?.data?.message || "Failed to schedule session");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-4"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <FiCalendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Schedule New Session
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a training session with your assigned clients
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TrainerSessionForm
            onSubmit={handleCreateSession}
            onCancel={() => navigate(-1)}
            loading={loading}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TrainerSessionCreate;
