import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiCalendar, FiUser, FiX } from "react-icons/fi";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import memberService from "../../../../services/memberService";
import sessionService from "../../../../services/sessionService";
import trainerService from "../../../../services/trainerService";

const SessionModal = ({
  isModalOpen,
  mode,
  selectedSession,
  handleCloseModal,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    trainerId: "",
    memberId: "",
    date: "",
    status: "scheduled",
    notes: "",
  });

  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load trainers and members
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load active trainers
        const trainerResponse = await trainerService.getAllTrainer({
          status: "active",
          all: true,
        });
        if (trainerResponse.success) {
          setTrainers(trainerResponse.data || []);
        }

        // Load active members
        const memberResponse = await memberService.getAllMember({
          status: "active",
          all: true,
        });
        if (memberResponse.success) {
          setMembers(memberResponse.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    if (isModalOpen) {
      loadData();
    }
  }, [isModalOpen]);

  // Populate form when editing
  useEffect(() => {
    if (mode === "update" && selectedSession) {
      setFormData({
        trainerId: selectedSession.trainer?._id || "",
        memberId: selectedSession.member?._id || "",
        date: selectedSession.date
          ? new Date(selectedSession.date).toISOString().slice(0, 16)
          : "",
        status: selectedSession.status || "scheduled",
        notes: selectedSession.notes || "",
      });
    } else if (mode === "view" && selectedSession) {
      setFormData({
        trainerId: selectedSession.trainer?._id || "",
        memberId: selectedSession.member?._id || "",
        date: selectedSession.date
          ? new Date(selectedSession.date).toISOString().slice(0, 16)
          : "",
        status: selectedSession.status || "scheduled",
        notes: selectedSession.notes || "",
      });
    } else {
      setFormData({
        trainerId: "",
        memberId: "",
        date: "",
        status: "scheduled",
        notes: "",
      });
    }
    setErrors({});
  }, [mode, selectedSession]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.trainerId) {
      newErrors.trainerId = "Trainer is required";
    }
    if (!formData.memberId) {
      newErrors.memberId = "Member is required";
    }
    if (!formData.date) {
      newErrors.date = "Date and time are required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await sessionService.createSession(formData);
        showSuccess("Session created successfully");
      } else if (mode === "update") {
        await sessionService.updateSession(selectedSession._id, formData);
        showSuccess("Session updated successfully");
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving session:", error);
      showError(error.response?.data?.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  const getTrainerName = (trainer) => {
    if (!trainer) return "Unknown Trainer";
    return trainer.user
      ? `${trainer.user.firstName} ${trainer.user.lastName}`
      : "Unknown Trainer";
  };

  const getMemberName = (member) => {
    if (!member) return "Unknown Member";
    return member.user
      ? `${member.user.firstName} ${member.user.lastName}`
      : "Unknown Member";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/30";
      case "completed":
        return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const isViewMode = mode === "view";

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {mode === "create" && "Schedule New Session"}
                {mode === "update" && "Update Session"}
                {mode === "view" && "Session Details"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Trainer Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trainer <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiUser className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedSession?.trainer
                        ? getTrainerName(selectedSession.trainer)
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  <select
                    name="trainerId"
                    value={formData.trainerId}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                      errors.trainerId
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200`}
                  >
                    <option value="">Select a trainer</option>
                    {trainers.map((trainer) => (
                      <option key={trainer._id} value={trainer._id}>
                        {getTrainerName(trainer)}
                        {trainer.specializations?.length > 0 &&
                          ` - ${trainer.specializations.join(", ")}`}
                      </option>
                    ))}
                  </select>
                )}
                {errors.trainerId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.trainerId}
                  </p>
                )}
              </div>

              {/* Member Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiUser className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedSession?.member
                        ? getMemberName(selectedSession.member)
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  <select
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                      errors.memberId
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200`}
                  >
                    <option value="">Select a member</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {getMemberName(member)}
                        {member.membershipPlan &&
                          ` - ${member.membershipPlan.name}`}
                      </option>
                    ))}
                  </select>
                )}
                {errors.memberId && (
                  <p className="mt-1 text-sm text-red-500">{errors.memberId}</p>
                )}
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date & Time <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <FiCalendar className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-800 dark:text-gray-200">
                      {selectedSession?.date
                        ? new Date(selectedSession.date).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                ) : (
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                      errors.date
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200`}
                  />
                )}
                {errors.date && (
                  <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                {isViewMode ? (
                  <div className="flex items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        selectedSession?.status
                      )}`}
                    >
                      {selectedSession?.status || "N/A"}
                    </span>
                  </div>
                ) : (
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
                      errors.status
                        ? "border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200`}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
                {errors.status && (
                  <p className="mt-1 text-sm text-red-500">{errors.status}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                {isViewMode ? (
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200">
                      {selectedSession?.notes || "No notes"}
                    </p>
                  </div>
                ) : (
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={loading}
                    rows={4}
                    placeholder="Add any notes about the session..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 resize-none"
                  />
                )}
              </div>

              {/* Footer */}
              {!isViewMode && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading
                      ? "Saving..."
                      : mode === "create"
                      ? "Schedule"
                      : "Update"}
                  </button>
                </div>
              )}

              {isViewMode && (
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SessionModal;
