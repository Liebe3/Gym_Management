import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiSave,
} from "react-icons/fi";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import trainerService from "../../../../services/trainerService";
import userService from "../../../../services/userService";

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

const specializationOptions = [
  "weight_training",
  "cardio",
  "yoga",
  "pilates",
  "crossfit",
  "bodybuilding",
  "powerlifting",
  "functional_training",
  "zumba",
  "martial_arts",
  "swimming",
  "personal_training",
  "group_fitness",
  "nutrition",
  "rehabilitation",
  "sports_specific",
  "other",
];

const formModes = {
  Create: "create",
  Update: "update",
};

const TrainerForm = ({
  mode = formModes.Create,
  trainerId = null,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if selected user already has a trainer profile
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

  // Load users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setUserLoading(true);
      try {
        const userResponse = await userService.getAllUser();
        const allUsers = userResponse?.data || [];

        // Filter users with 'trainer' role only
        const trainerUsers = allUsers.filter((user) => user.role === "trainer");
        setUsers(trainerUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const handleSocialMediaChange = (platform, value) => {
    setForm((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleSpecializationToggle = (specialization) => {
    setForm((prev) => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter((s) => s !== specialization)
        : [...prev.specializations, specialization],
    }));
  };

  const handleReset = () => {
    if (mode === formModes.Create) {
      setForm(initialForm);
      setSelectedUserTrainerProfile(null);
    } else if (trainerId) {
      loadTrainerData();
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
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              User *
            </label>
            <select
              value={form.userId}
              onChange={(e) => handleInputChange("userId", e.target.value)}
              required
              disabled={mode === formModes.Update} // Disable in update mode
              className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                mode === formModes.Update ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <option value="">Select a user</option>
              {Array.isArray(users) &&
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
            </select>

            {mode === formModes.Update && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                User cannot be changed when updating
              </p>
            )}

            {/* Show info about filtered users */}
            {!userLoading && users.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                No users with 'trainer' role found
              </p>
            )}

            {/* Trainer Profile Check - Only show in create mode */}
            {mode === formModes.Create && checkingTrainerProfile && (
              <div className="mt-2 flex items-center text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-xs">
                  Checking existing trainer profile...
                </span>
              </div>
            )}

            {mode === formModes.Create && selectedUserTrainerProfile && (
              <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start">
                  <FiAlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                      Existing Trainer Profile Found
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      This user already has a trainer profile (Status:{" "}
                      {selectedUserTrainerProfile.status}). Please update the
                      existing profile instead of creating a new one.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {mode === formModes.Create &&
              form.userId &&
              !checkingTrainerProfile &&
              !selectedUserTrainerProfile && (
                <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-xs">
                    User is available for trainer profile creation
                  </span>
                </div>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience (years)
            </label>
            <input
              type="number"
              min="0"
              value={form.experience}
              onChange={(e) =>
                handleInputChange("experience", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Specializations
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {specializationOptions.map((spec) => (
              <label
                key={spec}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.specializations.includes(spec)}
                  onChange={() => handleSpecializationToggle(spec)}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                  {spec.replace(/_/g, " ")}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Schedule */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
            <FiClock className="mr-2" />
            Work Schedule
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(form.workSchedule).map(([day, schedule]) => (
              <div
                key={day}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {day}
                  </span>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={schedule.isWorking}
                      onChange={(e) =>
                        handleWorkScheduleChange(
                          day,
                          "isWorking",
                          e.target.checked
                        )
                      }
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Working
                    </span>
                  </label>
                </div>
                {schedule.isWorking && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) =>
                          handleWorkScheduleChange(
                            day,
                            "startTime",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) =>
                          handleWorkScheduleChange(
                            day,
                            "endTime",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Social Media
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(form.socialMedia).map(([platform, value]) => (
              <div key={platform}>
                <label className="block text-xs text-gray-500 mb-1 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={value}
                  onChange={(e) =>
                    handleSocialMediaChange(platform, e.target.value)
                  }
                  placeholder={`${
                    platform.charAt(0).toUpperCase() + platform.slice(1)
                  } URL`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Image & Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={form.profileImage}
              onChange={(e) =>
                handleInputChange("profileImage", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 mt-6">
            <input
              type="checkbox"
              id="availableForClients"
              checked={form.isAvailableForNewClients}
              onChange={(e) =>
                handleInputChange("isAvailableForNewClients", e.target.checked)
              }
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <label
              htmlFor="availableForClients"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Available for New Clients
            </label>
          </div>
        </div>

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
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FiSave className="w-4 h-4 mr-2" />
            )}
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
