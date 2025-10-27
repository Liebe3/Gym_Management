// SessionForm.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import memberService from "../../../../services/memberService";
import trainerService from "../../../../services/trainerService";
import sessionService from "../../../../services/sessionService";
import { showError, showSuccess } from "../../../../pages/utils/Alert";

import TrainerSelect from "./TrainerSelect";
import MemberSelect from "./MemberSelect";
import DateTimeInput from "./DateTimeInput";
import StatusBadge from "./StatusBadge";
import NotesInput from "./NotesInput";

const SessionForm = ({ mode, selectedSession, handleCloseModal, onSuccess }) => {
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
  const isViewMode = mode === "view";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [trainerRes, memberRes] = await Promise.all([
          trainerService.getAllTrainer({ status: "active", all: true }),
          memberService.getAllMember({ status: "active", all: true }),
        ]);
        if (trainerRes.success) setTrainers(trainerRes.data || []);
        if (memberRes.success) setMembers(memberRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setFormData({
        trainerId: selectedSession.trainer?._id || "",
        memberId: selectedSession.member?._id || "",
        date: selectedSession.date
          ? new Date(selectedSession.date).toISOString().slice(0, 16)
          : "",
        status: selectedSession.status || "scheduled",
        notes: selectedSession.notes || "",
      });
    }
  }, [selectedSession, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.trainerId) errs.trainerId = "Trainer is required";
    if (!formData.memberId) errs.memberId = "Member is required";
    if (!formData.date) errs.date = "Date and time are required";
    if (!formData.status) errs.status = "Status is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const [datePart, timePart] = formData.date.split("T");
      const payload = {
        trainerId: formData.trainerId,
        memberId: formData.memberId,
        date: datePart,
        time: timePart?.slice(0, 5),
        status: formData.status,
        notes: formData.notes,
      };

      if (mode === "create") {
        await sessionService.createSession(payload);
        showSuccess("Session created successfully");
      } else if (mode === "update") {
        await sessionService.updateSession(selectedSession._id, payload);
        showSuccess("Session updated successfully");
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-900 rounded-xl 50 shadow-lg border border-gray-200 dark:border-gray-700 p-6 dark:text-amber-50" 
      >

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <TrainerSelect {...{ formData, trainers, handleChange, errors, isViewMode, loading, selectedSession }} />
      <MemberSelect {...{ formData, members, handleChange, errors, isViewMode, loading, selectedSession }} />
      <DateTimeInput {...{ formData, handleChange, errors, isViewMode, loading, selectedSession }} />
      <StatusBadge {...{ formData, handleChange, errors, isViewMode, loading, selectedSession }} />
      <NotesInput {...{ formData, handleChange, isViewMode, loading, selectedSession }} />

      {/* Footer */}
      {!isViewMode ? (
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            disabled={loading}
            className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            {loading ? "Saving..." : mode === "create" ? "Schedule" : "Update"}
          </button>
        </div>
      ) : (
        <div className="pt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="w-full px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            Close
          </button>
        </div>
      )}
    </form>
    </motion.div>
  );
};

export default SessionForm;
