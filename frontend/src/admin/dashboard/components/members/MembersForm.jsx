import { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

import userService from "../../../../services/userService";
import membershipPlanService from "../../../../services/membershipPlansService";
import memberService from "../../../../services/memberService";
import { showSuccess, showError } from "../../../../pages/utils/Alert";

const initialForm = {
  userId: "",
  membershipPlanId: "",
  startDate: "",
  endDate: "",
  status: "pending",
  autoRenew: false,
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
  const [users, setUsers] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserActivePlan, setSelectedUserActivePlan] = useState(null);
  const [checkingActivePlan, setCheckingActivePlan] = useState(false);

  useEffect(() => {
    if (mode === formModes.Update && selectedMember) {
      setForm({
        userId: selectedMember.user?._id || "",
        membershipPlanId: selectedMember.membershipPlan?._id || "",
        startDate: selectedMember.startDate
          ? new Date(selectedMember.startDate).toISOString().split("T")[0]
          : "",
        endDate: selectedMember.endDate
          ? new Date(selectedMember.endDate).toISOString().split("T")[0]
          : "",
        status: selectedMember.status || "pending",
        autoRenew: selectedMember.autoRenew || false,
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, selectedMember]);

  // Fixed handleChange to properly handle checkboxes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    // Check for active plan when user is selected
    if (name === "userId" && value && mode === formModes.Create) {
      checkUserActivePlan(value);
    } else if (name === "userId" && !value) {
      setSelectedUserActivePlan(null);
    }
  };

  // Function to check if selected user has an active membership
  const checkUserActivePlan = async (userId) => {
    if (!userId) return;

    setCheckingActivePlan(true);
    try {
      const response = await memberService.checkUserActiveMembership(userId);
      // Use the correct property from backend
      setSelectedUserActivePlan(response.actviveMemberShip || null);
    } catch (error) {
      console.error("Error checking user active membership:", error);
      setSelectedUserActivePlan(null);
    } finally {
      setCheckingActivePlan(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching users...");
        const userResponse = await userService.getAllUser();
        console.log("User Response:", userResponse);
        setUsers(userResponse?.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchMemberShipPlans = async () => {
      try {
        console.log("Fetching membership plans...");
        const memberShipPlansResponse =
          await membershipPlanService.getAllPlans();
        console.log("Membership Plans Response:", memberShipPlansResponse);
        setMembershipPlans(memberShipPlansResponse?.data || []);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      }
    };
    fetchMemberShipPlans();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === formModes.Create) {
      await handleCreateMember(event);
    } else {
      await handleUpdateMember(event);
    }
  };

  const handleCreateMember = async (event) => {
    event.preventDefault();

    // Frontend validation for active membership
    if (selectedUserActivePlan) {
      showError("This user already has an active membership plan");
      return;
    }

    // Frontend validation for start/end dates
    // Frontend validation for start/end dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time

    if (form.startDate) {
      const start = new Date(form.startDate);
      if (start < today) {
        showError("Start date cannot be in the past");
        return;
      }
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (end < start) {
        showError("End date cannot be before start date");
        return;
      }

      if (end < today) {
        showError("End date cannot be in the past");
        return;
      }
    }

    setLoading(true);

    try {
      const submitData = {
        userId: form.userId,
        membershipPlanId: form.membershipPlanId,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        status: form.status,
        autoRenew: form.autoRenew,
      };

      console.log("Submitting data:", submitData);

      const result = await memberService.createMember(submitData);

      if (result.success) {
        console.log("Member created successfully:", result.data);
        setForm(initialForm);
        setSelectedUserActivePlan(null);
        showSuccess("Member created successfully");
        if (onSuccess) onSuccess();
      } else {
        console.error("Error creating member:", result.message);
        showError(result.message || "Error creating member");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle specific error messages from backend
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError("Failed to create member. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  //update member
  const handleUpdateMember = async (event) => {
    if (!selectedMember) {
      showError("No member selected for update");
      return;
    }

    if (form.startDate && form.endDate) {
      const start = new Date(form.startDate);
      const end = new Date(form.endDate);

      if (end <= start) {
        showError("End date must be after start date");
        return;
      }
    }

    setLoading(true);

    try {
      const memberData = {
        status: form.status,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      const result = await memberService.updateMember(
        selectedMember._id,
        memberData
      );

      if (result.success) {
        showSuccess("Member updated Successfully");
        if (onSuccess) onSuccess();
      } else {
        showError(result.message || "Error updating member");
      }
    } catch (error) {
      if (error.response?.data?.messge) {
        showError(error.response.data.message);
      } else {
        showError("Failed to update member");
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
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              User
            </label>
            <select
              id="userId"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              required
              disabled={mode === formModes.Update} // Disable in update mode
              className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500 ${
                       mode === formModes.Update
                         ? "opacity-60 cursor-not-allowed"
                         : ""
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

            {/* Active Plan Warning - Only show in create mode */}
            {mode === formModes.Create && checkingActivePlan && (
              <div className="mt-2 flex items-center text-blue-600 dark:text-blue-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-xs">Checking active membership...</span>
              </div>
            )}

            {mode === formModes.Create && selectedUserActivePlan && (
              <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start">
                  <FiAlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                      Active Membership Found
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      This user has an active{" "}
                      {selectedUserActivePlan.membershipPlan?.name} plan until{" "}
                      {new Date(
                        selectedUserActivePlan.endDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {mode === formModes.Create &&
              form.userId &&
              !checkingActivePlan &&
              !selectedUserActivePlan && (
                <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-xs">
                    User is available for new membership
                  </span>
                </div>
              )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Membership Plan
            </label>
            <select
              id="membershipPlanId"
              name="membershipPlanId"
              value={form.membershipPlanId}
              onChange={handleChange}
              required
              disabled={mode === formModes.Update} // Disable in update mode
              className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white focus:outline-none 
                      focus:ring-2 focus:ring-emerald-500 ${
                        mode === formModes.Update
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
            >
              <option value="">Select a plan</option>
              {Array.isArray(membershipPlans) && membershipPlans.length > 0 ? (
                membershipPlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.name} - ${plan.price} ({plan.duration}{" "}
                    {plan.durationType})
                  </option>
                ))
              ) : (
                <option disabled>No plans available</option>
              )}
            </select>
            {mode === formModes.Update && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Membership plan cannot be changed when updating
              </p>
            )}
            {membershipPlans.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No membership plans loaded. Check console for errors.
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Start & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500"
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
              id="endDate"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mode === formModes.Create
                ? "Leave empty to auto-calculate"
                : "Update the membership end date"}
            </p>
          </div>
        </div>

        {/* Row 3: Status & Auto Renew */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 
                     dark:border-gray-600 bg-white dark:bg-gray-900 
                     text-gray-900 dark:text-white focus:outline-none 
                     focus:ring-2 focus:ring-emerald-500"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="autoRenew"
              name="autoRenew"
              checked={form.autoRenew}
              onChange={handleChange}
              disabled={mode === formModes.Update} // Disable in update mode
              className={`h-4 w-4 text-emerald-600 focus:ring-emerald-500 
                     border-gray-300 rounded ${
                       mode === formModes.Update
                         ? "opacity-60 cursor-not-allowed"
                         : ""
                     }`}
            />
            <label
              htmlFor="autoRenew"
              className="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Auto Renew {mode === formModes.Update && "(Cannot be changed)"}
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => {
              if (mode === formModes.Create) {
                setForm(initialForm);
                setSelectedUserActivePlan(null);
              } else {
                // Reset to original member data in update mode
                if (selectedMember) {
                  setForm({
                    userId: selectedMember.user?._id || "",
                    membershipPlanId: selectedMember.membershipPlan?._id || "",
                    startDate: selectedMember.startDate
                      ? new Date(selectedMember.startDate)
                          .toISOString()
                          .split("T")[0]
                      : "",
                    endDate: selectedMember.endDate
                      ? new Date(selectedMember.endDate)
                          .toISOString()
                          .split("T")[0]
                      : "",
                    status: selectedMember.status || "pending",
                    autoRenew: selectedMember.autoRenew || false,
                  });
                }
              }
            }}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 
                   text-gray-700 dark:text-gray-300 rounded-xl 
                   hover:bg-gray-50 dark:hover:bg-gray-800 
                   transition duration-200"
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
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 
                   text-white rounded-xl font-medium shadow-lg 
                   transition duration-200 disabled:opacity-50 
                   disabled:cursor-not-allowed"
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

export default MembersForm;
