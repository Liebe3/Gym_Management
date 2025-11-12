import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import DateTimeInput from "../../admin/dashboard/components/session/DateTimeInput";
import { showError } from "../../pages/utils/Alert";
import trainerService from "../../services/trainerService";

import NotesInput from "../../admin/dashboard/components/session/NotesInput";
import StatusBadge from "../../admin/dashboard/components/session/StatusBadge";
import TrainerClientSelect from "./TrainerClientSelect";

const TrainerSessionForm = ({
  onSubmit,
  onCancel,
  loading,
  mode,
  selectedSession,
}) => {
  const [formData, setFormData] = useState({
    trainerId: "",
    memberId: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    notes: "",
  });

  const [clients, setClients] = useState([]);
  const [trainerProfile, setTrainerProfile] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadTrainerData = async () => {
      try {
        setLoadingData(true);
        // Get trainer profile
        const profileRes = await trainerService.getMyProfile();
        if (profileRes.success) {
          setTrainerProfile(profileRes.data);
          setFormData((prev) => ({
            ...prev,
            trainerId: profileRes.data._id,
          }));
        }

        // Get assigned clients
        const clientsRes = await trainerService.getMyClients({
          status: "active",
          all: true,
        });
        if (clientsRes.success) {
          setClients(clientsRes.data || []);
        }
      } catch (error) {
        console.error("Error loading trainer data:", error);
        showError("Failed to load data");
      } finally {
        setLoadingData(false);
      }
    };

    loadTrainerData();
  }, []);

  // If in update/view mode, populate formData from selectedSession
  useEffect(() => {
    if (selectedSession && (mode === "update" || mode === "view")) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      setFormData({
        trainerId: selectedSession.trainer?._id || "",
        memberId: selectedSession.member?._id || "",
        date: formatDate(selectedSession.date),
        startTime: selectedSession.startTime || "",
        endTime: selectedSession.endTime || "",
        status: selectedSession.status || "scheduled",
        notes: selectedSession.notes || "",
      });
    }
  }, [selectedSession, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errs = {};

    if (!formData.memberId) errs.memberId = "Please select a client";
    if (!formData.date) errs.date = "Date is required";
    if (!formData.startTime) errs.startTime = "Start time is required";
    if (!formData.endTime) errs.endTime = "End time is required";
    if (!formData.status) errs.status = "Status is required";

    // Validate time range
    if (formData.startTime && formData.endTime) {
      const [startHour, startMin] = formData.startTime.split(":").map(Number);
      const [endHour, endMin] = formData.endTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        errs.endTime = "End time must be after start time";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      showError("Please fill in all required fields correctly");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      // Error is handled in parent component
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false); // stop submitting
    }
  };

  if (loadingData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Info Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            <strong>Note:</strong> You can only schedule sessions with clients
            assigned to you. If you don't see a client in the list, they may not
            be assigned to your training program yet.
          </p>
        </div>

        {/* Client Selection */}
        <TrainerClientSelect
          formData={formData}
          clients={clients}
          handleChange={handleChange}
          errors={errors}
          loading={loading}
          mode={mode}
          isViewMode={mode === "view"}
          selectedSession={selectedSession}
        />

        {/* Show warning if no clients */}
        {clients.length === 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              You don't have any assigned clients yet. Please contact the
              administrator to have clients assigned to you.
            </p>
          </div>
        )}

        {/* Date & Time */}
        <DateTimeInput
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isViewMode={false}
          loading={loading}
        />

        {/* Status */}
        <StatusBadge
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isViewMode={false}
          loading={loading}
        />

        {/* Notes */}
        <NotesInput
          formData={formData}
          handleChange={handleChange}
          isViewMode={false}
          loading={loading}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading || isSubmitting}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting || clients.length === 0}
            className="flex-1 px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-emerald-500/30"
          >
            {loading || isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Scheduling...
              </span>
            ) : (
              "Schedule Session"
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TrainerSessionForm;
