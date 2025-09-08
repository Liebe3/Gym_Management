import { useEffect, useState } from "react";
import { showError, showSuccess } from "../../../../pages/utils/Alert";
import membershipPlanService from "../../../../services/membershipPlansService";

const initialForm = {
  name: "",
  price: "",
  duration: "",
  durationType: "months",
  description: "",
  features: "",
  status: "inactive",
};

const formModes = {
  Create: "create",
  Update: "update",
};

const MemberShipPlanForm = ({
  mode = formModes.Create,
  selectedPlan,
  onSuccess,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (mode === formModes.Update && selectedPlan) {
      setForm({
        ...selectedPlan,
        features: Array.isArray(selectedPlan.features)
          ? selectedPlan.features.join(", ")
          : selectedPlan.features || "",
      });
    }
  }, [mode, selectedPlan]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const prepareSubmissionData = (formData) => {
    return {
      ...formData,
      features: formData.features.split(",").map((feature) => feature.trim()),
    };
  };

  const handleCreatePlan = async (event) => {
    event.preventDefault();

    const planData = prepareSubmissionData(form);
    try {
      let response;
      if (mode === "create") {
        response = await membershipPlanService.createPlan(planData);
      } else {
        response = await membershipPlanService.updatePlan(
          selectedPlan._id,
          planData
        );
      }

      showSuccess(response.message || "Plan created successfully");
      setForm(initialForm);
      if (onSuccess) onSuccess();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create plan";

      console.error("Error details:", error);
      showError(errorMessage);
    }
  };

  return (
    <div className="w-full">
      {/* Form */}
      <form onSubmit={handleCreatePlan} className="space-y-6">
        {/* Row 1: Plan Name and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Plan Name
            </label>
            <input
              value={form.name}
              type="text"
              name="name"
              placeholder="e.g., Basic Plan"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Price (₱)
            </label>
            <input
              value={form.price}
              type="number"
              name="price"
              placeholder="999"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Row 2: Duration and Duration Type */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration
            </label>
            <input
              value={form.duration}
              type="number"
              name="duration"
              placeholder="1"
              required
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration Type
            </label>
            <select
              value={form.durationType}
              name="durationType"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={form.status}
              name="status"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Row 3: Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={form.description}
            name="description"
            rows="3"
            placeholder="e.g., Ideal for beginners, includes gym access and group classes"
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Row 4: Features */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Features
          </label>
          <textarea
            value={form.features}
            name="features"
            rows="3"
            placeholder="e.g., Personal training, Sauna access, Free classes (separate with commas)"
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Separate features with commas (e.g., "Feature 1, Feature 2, Feature
            3")
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setForm(initialForm)}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition duration-200 cursor-pointer"
          >
            {mode === "create" ? "Create Plan" : "Update Plan"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberShipPlanForm;
