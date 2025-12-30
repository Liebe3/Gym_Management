import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import memberSessionService from "../../../../services/memberPanel/memberSessionService";

const initialForm = {
  trainerId: "",
  date: "",
  startTime: "",
  endTime: "",
  notes: "",
};

const BookSessionForm = ({ onSuccess, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const [trainers, setTrainers] = useState([]);
  const [trainerLoading, setTrainerLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trainerError, setTrainerError] = useState("");

  // Fetch assigned trainers on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      setTrainerLoading(true);
      setTrainerError("");
      try {
        const trainersData = await memberSessionService.getAssignedTrainers();
        console.log("Fetched trainers:", trainersData); // Debug log

        // Filter to only show active trainers
        const activeTrainers = (trainersData || []).filter(
          (trainer) => trainer.status === "active"
        );

        console.log("Active trainers:", activeTrainers); // Debug log
        setTrainers(activeTrainers);

        // Set error message if no active trainers are available
        if (activeTrainers.length === 0) {
          setTrainerError(
            "No active trainers available at the moment."
          );
        }
      } catch (err) {
        console.error("Error fetching trainers:", err);
        showError("Failed to load trainers");
      } finally {
        setTrainerLoading(false);
      }
    };
    fetchTrainers();
  }, []);

  const handleInputChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const validateForm = () => {
    // Check required fields
    if (!form.trainerId || !form.date || !form.startTime || !form.endTime) {
      showError("Please fill in all required fields");
      return false;
    }

    // Validate that selected trainer is still active
    const selectedTrainer = trainers.find((t) => t._id === form.trainerId);
    if (!selectedTrainer) {
      showError("Selected trainer is not available");
      return false;
    }

    if (selectedTrainer.status !== "active") {
      showError(
        "This trainer is no longer available. Please select another trainer."
      );
      return false;
    }

    // Validate time format
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(form.startTime) || !timeRegex.test(form.endTime)) {
      showError("Invalid time format. Use HH:MM (24-hour format)");
      return false;
    }

    // Validate end time is after start time
    const [startHour, startMin] = form.startTime.split(":").map(Number);
    const [endHour, endMin] = form.endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      showError("End time must be after start time");
      return false;
    }

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(form.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showError("Session date cannot be in the past");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        trainerId: form.trainerId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        notes: form.notes || undefined,
      };

      const response = await memberSessionService.bookSession(submitData);

      if (response.success) {
        showSuccess("Session booked successfully!");
        setForm(initialForm);
        if (onSuccess) onSuccess();
      } else {
        showError(response.message || "Failed to book session");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Failed to book session");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Trainer Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Trainer <span className="text-red-500">*</span>
          </label>
          <select
            value={form.trainerId}
            onChange={(e) => handleInputChange("trainerId", e.target.value)}
            disabled={trainerLoading || loading || trainers.length === 0}
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {trainerLoading
                ? "Loading trainers..."
                : trainers.length === 0
                ? "No active trainers available"
                : "Choose a trainer"}
            </option>
            {trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.firstName} {trainer.lastName}
                {trainer.specializations && trainer.specializations.length > 0
                  ? ` - ${trainer.specializations.join(", ")}`
                  : ""}
                {trainer.isPrimary ? " (Primary)" : ""}
              </option>
            ))}
          </select>
          {trainerError && (
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">
              {trainerError}
            </p>
          )}
          {!trainerError && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {trainers.length === 0 && !trainerLoading
                ? "No available trainers assigned to you"
                : "Select from your assigned available trainers"}
            </p>
          )}
        </div>

        {/* Row 2: Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Session Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              disabled={loading}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              disabled={loading}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              disabled={loading}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Row 3: Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Session Notes{" "}
            <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            disabled={loading}
            rows="3"
            placeholder="Add any notes or special requirements for this session..."
            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              handleReset();
              if (onClose) onClose();
            }}
            disabled={loading}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || trainerLoading || trainers.length === 0}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Booking..." : "Book Session"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookSessionForm;
