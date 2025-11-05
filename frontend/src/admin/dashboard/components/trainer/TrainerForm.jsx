import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import trainerService from "../../../../services/trainerService";
import ExperienceInput from "./ExperienceInput";
import GenderSelect from "./GenderSelect";
import SpecializationsInput from "./SpecializationsInput";
import StatusSelect from "./StatusSelect";
import TrainerAvailabity from "./TrainerAvailability";
import UserSelect from "./UserSelect";
import WorkScheduleInput from "./WorkScheduleInput";

const initialForm = {
  userId: "",
  gender: "",
  specializations: [],
  experience: 0,
  status: "active",
  workSchedule: {
    monday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
    tuesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
    wednesday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
    thursday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
    friday: { isWorking: true, startTime: "09:00", endTime: "17:00" },
    saturday: { isWorking: false, startTime: "", endTime: "" },
    sunday: { isWorking: false, startTime: "", endTime: "" },
  },
  isAvailableForNewClients: true,
};

const formModes = {
  View: "view",
  Create: "create",
  Update: "update",
};

const TrainerForm = ({
  mode = formModes.Create,
  trainerId = null,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const [selectedUserTrainerProfile, setSelectedUserTrainerProfile] =
    useState(null);
  const [checkingTrainerProfile, setCheckingTrainerProfile] = useState(false);
  const isViewMode = mode === formModes.View;

  // Load trainer data if updating
  useEffect(() => {
    if ((mode === formModes.Update || mode === formModes.View) && trainerId) {
      loadTrainerData();
    } else {
      setForm(initialForm);
    }
  }, [mode, trainerId]);

  const loadTrainerData = async () => {
    try {
      setLoading(true);
      const response = await trainerService.getTrainerById(trainerId);
      if (response.success) {
        setForm({
          ...response.data,
          userId: response.data.user?._id || "",
        });
      }
    } catch (error) {
      showError("Failed to load trainer data");
    } finally {
      setLoading(false);
    }
  };

  // Function to check if selected user already has a trainer profile
  const checkUserTrainerProfile = async (userId) => {
    if (!userId) return;

    setCheckingTrainerProfile(true);
    try {
      // Get all trainers and check if any has this user ID
      const response = await trainerService.getAllTrainer({ limit: 1000 });
      const existingTrainer = response.data?.find(
        (trainer) => trainer.user?._id === userId
      );
      setSelectedUserTrainerProfile(existingTrainer || null);
    } catch (error) {
      console.error("Error checking user trainer profile:", error);
      setSelectedUserTrainerProfile(null);
    } finally {
      setCheckingTrainerProfile(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      let updatedForm = { ...prev, [field]: value };

      // Force availability to false if status is not active
      if (field === "status" && value !== "active") {
        updatedForm.isAvailableForNewClients = false;
      }

      return updatedForm;
    });

    // Check trainer profile when user is selected (only in create mode)
    if (field === "userId") {
      if (value && mode === formModes.Create) {
        checkUserTrainerProfile(value);
      } else {
        setSelectedUserTrainerProfile(null);
      }
    }
  };

  const handleReset = () => {
    if (mode === formModes.Create) {
      setForm(initialForm);
      setSelectedUserTrainerProfile(null);
    } else if (trainerId) {
      loadTrainerData();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate work schedule: at least 1 working day
    const workingDays = Object.entries(form.workSchedule).filter(
      ([_, day]) => day.isWorking
    );

    for (const [day, schedule] of workingDays) {
      if (!schedule.startTime || !schedule.endTime) {
        showError(
          `Working day "${day}" must have both start time and end time`
        );
        return;
      }
    }

    if (workingDays.length === 0) {
      showError("Work schedule must have at least 1 working day");
      return;
    }

    // Frontend validation for existing trainer profile
    if (mode === formModes.Create && selectedUserTrainerProfile) {
      showError("This user already has a trainer profile");
      return;
    }

    setLoading(true);

    try {
      let response;
      const submitData = {
        ...form,
        // Don't send user ID in update mode since it can't be changed
        ...(mode === formModes.Update && { userId: undefined }),
      };

      if (mode === formModes.Create) {
        response = await trainerService.createTrainer(submitData);
      } else {
        response = await trainerService.updateTrainer(trainerId, submitData);
      }

      if (response.success) {
        showSuccess(
          mode === formModes.Create
            ? "Trainer created successfully"
            : "Trainer updated successfully"
        );
        onSuccess && onSuccess(response);
        if (mode === formModes.Create) {
          setForm(initialForm);
          setSelectedUserTrainerProfile(null);
        }
      } else {
        showError(response.message || "Operation failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form.userId) {
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
      className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* User dropdown */}
            <UserSelect
              value={form.userId}
              onChange={(value) => handleInputChange("userId", value)}
              mode={mode}
              disabled={isViewMode}
              selectedUserTrainerProfile={selectedUserTrainerProfile}
              checkingTrainerProfile={checkingTrainerProfile}
            />
          </div>

          {/* Gender dropdown */}
          <GenderSelect
            value={form.gender}
            onChange={(value) => handleInputChange("gender", value)}
            disabled={isViewMode}
          />

          {/* Experince input  */}
          <ExperienceInput
            value={form.experience}
            onChange={(value) => handleInputChange("experience", value)}
            disabled={isViewMode}
          />

          {/* Status dropdown */}
          <StatusSelect
            value={form.status}
            onChange={(value) => handleInputChange("status", value)}
            disabled={isViewMode}
          />
        </div>

        {/* specializations input */}
        <SpecializationsInput
          value={form.specializations}
          onChange={(newSpecialization) =>
            handleInputChange("specializations", newSpecialization)
          }
          disabled={isViewMode}
        />

        {/* workSchedule input */}
        <WorkScheduleInput
          value={form.workSchedule}
          onChange={(newSchedule) =>
            handleInputChange("workSchedule", newSchedule)
          }
          disabled={isViewMode}
        />

        {/* Availability */}
        <TrainerAvailabity
          value={form.isAvailableForNewClients}
          onChange={(value) =>
            handleInputChange("isAvailableForNewClients", value)
          }
          disabled={isViewMode || form.status !== "active"}
        />

        {/* Submit Buttons */}
        {!isViewMode && (
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
            >
              Reset
            </button>
            <motion.button
              type="submit"
              disabled={
                loading ||
                (mode === formModes.Create &&
                  (selectedUserTrainerProfile || checkingTrainerProfile))
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-medium shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading
                ? mode === formModes.Create
                  ? "Creating..."
                  : "Updating..."
                : mode === formModes.Create
                ? "Create Trainer"
                : "Update Trainer"}
            </motion.button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export { formModes };
export default TrainerForm;
