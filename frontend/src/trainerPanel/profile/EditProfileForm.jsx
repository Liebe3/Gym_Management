import { motion } from "framer-motion";
import { useState } from "react";

import { FiX as FiClose, FiSave } from "react-icons/fi";

import { showError, showSuccess } from "../../pages/utils/Alert";

import ExperienceInput from "../../admin/dashboard/components/trainer/ExperienceInput";
import GenderSelect from "../../admin/dashboard/components/trainer/GenderSelect";
import SpecializationsInput from "../../admin/dashboard/components/trainer/SpecializationsInput";
import TrainerAvailabity from "../../admin/dashboard/components/trainer/TrainerAvailability";
import WorkScheduleInput from "../../admin/dashboard/components/trainer/WorkScheduleInput";

const EditProfileForm = ({ trainer, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    gender: trainer.gender || "",
    experience: trainer.experience || 0,
    specializations: trainer.specializations || [],
    workSchedule: trainer.workSchedule || {},
    isAvailableForNewClients: trainer.isAvailableForNewClients || false,
  });

  const handleSubmit = () => {
    //  Specialization must not be empty
    if (!form.specializations || form.specializations.length === 0) {
      showError("Please select at least one specialization");
      return;
    }

    //  Validate at least 1 working day
    const workingDays = Object.entries(form.workSchedule).filter(
      ([_, day]) => day.isWorking
    );

    if (workingDays.length === 0) {
      showError("Work schedule must have at least one working day");
      return;
    }

    // Validate each working day must have start & end times
    for (const [day, schedule] of workingDays) {
      if (!schedule.startTime || !schedule.endTime) {
        showError(`Working day "${day}" must have both start and end time`);
        return;
      }
    }

    // If passed validation, submit
    onSave(form);
    showSuccess("Profile updated successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GenderSelect
            value={form.gender}
            onChange={(gender) => setForm((prev) => ({ ...prev, gender }))}
            disabled={false}
          />
          <ExperienceInput
            value={form.experience}
            onChange={(experience) =>
              setForm((prev) => ({ ...prev, experience }))
            }
            disabled={false}
          />
        </div>

        <SpecializationsInput
          value={form.specializations}
          onChange={(specializations) =>
            setForm((prev) => ({ ...prev, specializations }))
          }
          disabled={false}
        />
        <WorkScheduleInput
          value={form.workSchedule}
          onChange={(workSchedule) =>
            setForm((prev) => ({ ...prev, workSchedule }))
          }
          disabled={false}
        />
        <TrainerAvailabity
          value={form.isAvailableForNewClients}
          onChange={(isAvailable) =>
            setForm((prev) => ({
              ...prev,
              isAvailableForNewClients: isAvailable,
            }))
          }
          disabled={false}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-amber-50 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <FiClose className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-medium shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            <FiSave className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfileForm;
