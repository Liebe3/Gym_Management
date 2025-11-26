import { memo, useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import memberService from "../../../../services/memberService";
import membershipPlanService from "../../../../services/membershipPlansService";
import MembershipPlanSelect from "./MemberShipPlanSelect";
import StatusSelect from "./StatusSelect";
import TrainerSelect from "./TrainerSelect";
import UserSelect from "./UserSelect";

const initialForm = {
  userId: "",
  membershipPlanId: "",
  trainerId: "",
  startDate: "",
  endDate: "",
  status: "pending",
  // autoRenew: false,
};

const formModes = {
  Create: "create",
  Update: "update",
};

const MembersForm = ({
  mode = formModes.Create,
  selectedMember,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);

  const [selectedUserActivePlan, setSelectedUserActivePlan] = useState(null);
  const [checkingActivePlan, setCheckingActivePlan] = useState(false);

  const [loading, setLoading] = useState(false);

  // Load member data if updating
  useEffect(() => {
    if (mode === formModes.Update && selectedMember) {
      setForm({
        userId: selectedMember.user?._id || "",
        membershipPlanId: selectedMember.membershipPlan?._id || "",
        trainerId: selectedMember.trainer?._id || "",
        startDate: selectedMember.startDate
          ? new Date(selectedMember.startDate).toISOString().split("T")[0]
          : "",
        endDate: selectedMember.endDate
          ? new Date(selectedMember.endDate).toISOString().split("T")[0]
          : "",
        status: selectedMember.status || "pending",
        // autoRenew: selectedMember.autoRenew || false,
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, selectedMember]);

  // Fetch membership plans for end date calculation
  useEffect(() => {
    const fetchMemberShipPlans = async () => {
      setPlanLoading(true);
      try {
        const res = await membershipPlanService.getAllPlans({
          status: "active",
        });
        setMembershipPlans(res?.data || []);
      } catch (err) {
        console.error("Error fetching membership plans:", err);
      } finally {
        setPlanLoading(false);
      }
    };
    fetchMemberShipPlans();
  }, []);

  // Auto-calculate end date function
  const calculateEndDate = (startDateValue, planId) => {
    if (!startDateValue || !planId) return "";

    const plan = membershipPlans.find((p) => p._id === planId);
    if (!plan) return "";

    const start = new Date(startDateValue);
    let end = new Date(start);

    switch (plan.durationType) {
      case "days":
        end.setDate(end.getDate() + plan.duration);
        break;
      case "weeks":
        end.setDate(end.getDate() + plan.duration * 7);
        break;
      case "months":
        end.setMonth(end.getMonth() + plan.duration);
        break;
      case "years":
        end.setFullYear(end.getFullYear() + plan.duration);
        break;
      default:
        break;
    }

    return end.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Function to check if selected user has an active membership
  const checkUserActivePlan = async (userId) => {
    if (!userId) return;

    setCheckingActivePlan(true);
    try {
      const response = await memberService.checkUserActiveMembership(userId);
      setSelectedUserActivePlan(response.existingMembership || null);
    } catch (error) {
      console.error("Error checking user active membership:", error);
      setSelectedUserActivePlan(null);
    } finally {
      setCheckingActivePlan(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => {
      const updatedForm = {
        ...prev,
        [field]: value,
      };

      // Auto-calculate end date if startDate or membershipPlanId changes
      if (field === "startDate" || field === "membershipPlanId") {
        updatedForm.endDate = calculateEndDate(
          updatedForm.startDate,
          updatedForm.membershipPlanId
        );
      }

      return updatedForm;
    });

    // Check active plan when user is selected (only in create mode)
    if (field === "userId") {
      if (value && mode === formModes.Create) {
        checkUserActivePlan(value);
      } else {
        setSelectedUserActivePlan(null);
      }
    }
  };

  const handleReset = () => {
    if (mode === formModes.Create) {
      setForm(initialForm);
      setSelectedUserActivePlan(null);
    } else if (selectedMember) {
      setForm({
        userId: selectedMember.user?._id || "",
        membershipPlanId: selectedMember.membershipPlan?._id || "",
        trainerId: selectedMember.trainer?._id || "",
        startDate: selectedMember.startDate
          ? new Date(selectedMember.startDate).toISOString().split("T")[0]
          : "",
        endDate: selectedMember.endDate
          ? new Date(selectedMember.endDate).toISOString().split("T")[0]
          : "",
        status: selectedMember.status || "pending",
        // autoRenew: selectedMember.autoRenew || false,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Frontend validation for active membership (create mode only)
    if (mode === formModes.Create && selectedUserActivePlan) {
      showError("This user already has an active membership plan");
      return;
    }

    // Frontend validation for start/end dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (form.startDate) {
      const start = new Date(form.startDate);
      if (mode === formModes.Create && start < today) {
        showError("Start date cannot be in the past");
        return;
      }
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (end <= start) {
        showError("End date must be after start date");
        return;
      }

      if (mode === formModes.Create && end < today) {
        showError("End date cannot be in the past");
        return;
      }
    }

    setLoading(true);

    try {
      let response;
      const submitData = {
        userId: form.userId,
        membershipPlanId: form.membershipPlanId,
        trainerId: form.trainerId || undefined,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        status: form.status,
        // autoRenew: form.autoRenew,
      };

      if (mode === formModes.Create) {
        response = await memberService.createMember(submitData);
      } else {
        // In update mode, don't send userId
        delete submitData.userId;
        response = await memberService.updateMember(
          selectedMember._id,
          submitData
        );
      }

      if (response.success) {
        showSuccess(
          mode === formModes.Create
            ? "Member created successfully"
            : "Member updated successfully"
        );
        if (onSuccess) onSuccess();
        if (mode === formModes.Create) {
          setForm(initialForm);
          setSelectedUserActivePlan(null);
        }
      } else {
        showError(response.message || "Operation failed");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError(
          mode === formModes.Create
            ? "Failed to create member"
            : "Failed to update member"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: User and Membership Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UserSelect
            value={form.userId}
            onChange={(value) => handleInputChange("userId", value)}
            mode={mode}
            selectedUserActivePlan={selectedUserActivePlan}
            checkingActivePlan={checkingActivePlan}
            disabled={false}
          />

          <MembershipPlanSelect
            value={form.membershipPlanId}
            onChange={(value) => handleInputChange("membershipPlanId", value)}
            disabled={false}
            membershipPlans={membershipPlans}
            planLoading={planLoading}
          />
        </div>

        {/* Row 2: Trainer and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrainerSelect
            value={form.trainerId}
            onChange={(value) => handleInputChange("trainerId", value)}
            disabled={false}
          />

          <StatusSelect
            value={form.status}
            onChange={(value) => handleInputChange("status", value)}
            disabled={false}
          />
        </div>

        {/* Row 3: Start & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mode === formModes.Create
                ? "Leave empty to use current date"
                : "Update the membership start date"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              End Date
            </label>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => handleInputChange("endDate", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mode === formModes.Create
                ? "Leave empty to auto-calculate"
                : "Update the membership end date"}
            </p>
          </div>
        </div>

        {/* Row 4: Auto Renew */}
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            checked={form.autoRenew}
            onChange={(e) => handleInputChange("autoRenew", e.target.checked)}
            disabled={mode === formModes.Update}
            className={`h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded ${
              mode === formModes.Update ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />
          <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Auto Renew {mode === formModes.Update && "(Cannot be changed)"}
          </label>
        </div> */}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              (mode === formModes.Create &&
                (selectedUserActivePlan || checkingActivePlan))
            }
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? mode === formModes.Create
                ? "Creating..."
                : "Updating..."
              : mode === formModes.Create
              ? "Create Member"
              : "Update Member"}
          </button>
        </div>
      </form>
    </div>
  );
};

export { formModes };
export default MembersForm;
