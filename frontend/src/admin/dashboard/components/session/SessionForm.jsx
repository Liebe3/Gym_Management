import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import memberService from "../../../../services/memberService";
import sessionService from "../../../../services/sessionService";
import trainerService from "../../../../services/trainerService";

import DateTimeInput from "./DateTimeInput";
import MemberSelect from "./MemberSelect";
import NotesInput from "./NotesInput";
import StatusBadge from "./StatusBadge";
import TrainerSelect from "./TrainerSelect";

const SessionForm = ({
  mode,
  selectedSession,
  handleCloseModal,
  onSuccess,
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

  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const isViewMode = mode === "view";

  //  Filter members based on selected trainer
  const filteredMembers = useMemo(() => {
    if (!formData.trainerId) {
      return members;
    }
    return members.filter(
      (member) => member.trainer?._id === formData.trainerId
    );
  }, [formData.trainerId, members]);

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
    if (selectedSession && (mode === "update" || mode === "view")) {
      setFormLoading(true);

      // Wait for trainers/members to finish loading first
      if (trainers.length === 0 || members.length === 0) return;

      setFormData({
        trainerId: selectedSession.trainer?._id || "",
        memberId: selectedSession.member?._id || "",
        date: selectedSession.date
          ? new Date(selectedSession.date).toISOString().slice(0, 10)
          : "",
        startTime: selectedSession.startTime || "",
        endTime: selectedSession.endTime || "",
        status: selectedSession.status || "scheduled",
        notes: selectedSession.notes || "",
      });

      setFormLoading(false);
    }
  }, [selectedSession, mode, trainers, members]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    //  Reset memberId when trainer changes
    if (name === "trainerId") {
      setFormData((p) => ({ ...p, [name]: value, memberId: "" }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.trainerId) errs.trainerId = "Trainer is required";
    if (!formData.memberId) errs.memberId = "Member is required";
    if (!formData.date) errs.date = "Date is required";
    if (!formData.startTime) errs.startTime = "Start time is required";
    if (!formData.endTime) errs.endTime = "End time is required";
    if (!formData.status) errs.status = "Status is required";

    //  Additional validation: Check if selected member belongs to trainer
    if (formData.trainerId && formData.memberId) {
      const selectedMember = members.find((m) => m._id === formData.memberId);
      if (
        selectedMember &&
        selectedMember.trainer?._id !== formData.trainerId
      ) {
        errs.memberId = "Selected member is not assigned to this trainer";
      }
    }

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
      const payload = {
        trainerId: formData.trainerId,
        memberId: formData.memberId,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
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
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showError(error.response?.data?.message || "Failed to save session");
    } finally {
      setLoading(false);
    }
  };

  if (loading || formLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 dark:text-amber-50"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <TrainerSelect
          {...{
            formData,
            trainers,
            handleChange,
            errors,
            isViewMode,
            loading,
            selectedSession,
          }}
        />

        {/*  Pass filteredMembers instead of members */}
        <MemberSelect
          formData={formData}
          members={filteredMembers}
          handleChange={handleChange}
          errors={errors}
          isViewMode={isViewMode}
          loading={loading}
          selectedSession={selectedSession}
        />

        {/*  Show info message if trainer is selected but has no members */}
        {formData.trainerId && filteredMembers.length === 0 && !isViewMode && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              This trainer has no assigned members yet. Please assign members to
              this trainer first.
            </p>
          </div>
        )}

        <DateTimeInput
          {...{
            formData,
            handleChange,
            errors,
            isViewMode,
            loading,
            selectedSession,
          }}
        />
        <StatusBadge
          {...{
            formData,
            handleChange,
            errors,
            isViewMode,
            loading,
            selectedSession,
          }}
        />
        <NotesInput
          {...{ formData, handleChange, isViewMode, loading, selectedSession }}
        />

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
              disabled={
                loading || (formData.trainerId && filteredMembers.length === 0)
              }
              className="flex-1 px-6 py-3 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Schedule"
                : "Update"}
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
