import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import trainerService from "../../../../services/trainerService";
import Availability from "./Availability";
import ExperienceInput from "./ExperienceInput";
import GenderSelect from "./GenderSelect";
import SpecializationsInput from "./SpecializationsInput";
import StatusSelect from "./StatusSelect";
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
  profileImage: "",
  socialMedia: {
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  },
  isAvailableForNewClients: true,
};

const formModes = {
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
  const [error, setError] = useState("");

  const [newSpecialization, setNewSpecialization] = useState("");
  const [selectedUserTrainerProfile, setSelectedUserTrainerProfile] =
    useState(null);
  const [checkingTrainerProfile, setCheckingTrainerProfile] = useState(false);

  // Load trainer data if updating
  useEffect(() => {
    if (mode === formModes.Update && trainerId) {
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
      setError("Failed to load trainer data");
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
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Check trainer profile when user is selected (only in create mode)
    if (field === "userId") {
      if (value && mode === formModes.Create) {
        checkUserTrainerProfile(value);
      } else {
        setSelectedUserTrainerProfile(null);
      }
    }
  };

  const handleWorkScheduleChange = (day, field, value) => {
    setForm((prev) => ({
      ...prev,
      workSchedule: {
        ...prev.workSchedule,
        [day]: {
          ...prev.workSchedule[day],
          [field]: value,
        },
      },
    }));
  };

  // New function to add specialization
  const handleAddSpecialization = () => {
    const trimmedSpec = newSpecialization.trim();
    if (trimmedSpec && !form.specializations.includes(trimmedSpec)) {
      // Check length constraints (min 2, max 50 characters)
      if (trimmedSpec.length < 2) {
        showError("Specialization must be at least 2 characters long");
        return;
      }
      if (trimmedSpec.length > 50) {
        showError("Specialization must be less than 50 characters");
        return;
      }

      setForm((prev) => ({
        ...prev,
        specializations: [...prev.specializations, trimmedSpec],
      }));
      setNewSpecialization("");
    } else if (form.specializations.includes(trimmedSpec)) {
      showError("This specialization already exists");
    }
  };

  // New function to remove specialization
  const handleRemoveSpecialization = (specializationToRemove) => {
    setForm((prev) => ({
      ...prev,
      specializations: prev.specializations.filter(
        (spec) => spec !== specializationToRemove
      ),
    }));
  };

  // Handle Enter key press in specialization input
  const handleSpecializationKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSpecialization();
    }
  };

  const handleReset = () => {
    if (mode === formModes.Create) {
      setForm(initialForm);
      setSelectedUserTrainerProfile(null);
      setNewSpecialization("");
    } else if (trainerId) {
      loadTrainerData();
      setNewSpecialization("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

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
          setNewSpecialization("");
        }
      } else {
        setError(response.message || "Operation failed");
        showError(response.message || "Operation failed");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && mode === formModes.Update && !form.userId) {
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
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
        >
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* User dropdown */}
            <UserSelect
              value={form.userId}
              onChange={(value) => handleInputChange("userId", value)}
              mode={mode}
              selectedUserTrainerProfile={selectedUserTrainerProfile}
              checkingTrainerProfile={checkingTrainerProfile}
            />
          </div>

          {/* Gender dropdown */}
          <GenderSelect
            value={form.gender}
            onChange={(value) => handleInputChange("gender", value)}
          />

          {/* Experince input  */}
          <ExperienceInput
            value={form.experience}
            onChange={(value) => handleInputChange("experience", value)}
          />

          {/* Status dropdown */}
          <StatusSelect
            value={form.status}
            onChange={(value) => handleInputChange("status", value)}
          />
        </div>

        {/* specializations input */}
        <SpecializationsInput
          value={form.specializations}
          onChange={(newSpecialization) =>
            handleInputChange("specializations", newSpecialization)
          }
        />

        {/* workSchedule input */}
        <WorkScheduleInput
          value={form.workSchedule}
          onChange={(newSchedule) =>
            handleInputChange("workSchedule", newSchedule)
          }
        />

        {/* Availability */}
        <Availability
          value={form.availability}
          onChange={(val) => handleInputChange("availability", val)}
        />

        {/* Submit Buttons */}
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
      </form>
    </motion.div>
  );
};

export { formModes };
export default TrainerForm;
