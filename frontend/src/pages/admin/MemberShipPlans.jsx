import React, { useState } from "react";
import membershipPlanService from "../../services/membershipPlansService";

const MemberShipPlans = () => {
  const initialPlansState = {
    name: "",
    price: "",
    duration: "",
    durationType: "months",
    description: "",
    features: "",
    status: "active",
  };

  const [plansForm, setPlansForm] = useState(initialPlansState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlansForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const planData = {
        ...plansForm,
        features: plansForm.features
          .split(",")
          .map((feature) => feature.trim())
          .filter((feature) => feature),
        price: Number(plansForm.price),
        duration: Number(plansForm.duration),
      };

      await membershipPlanService.createPlan(planData);
      setSuccess("Plan created successfully!");
      setPlansForm(initialPlansState);
    } catch (error) {
      setError(error.message || "Failed to create plan");
      console.error("Error creating plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Membership Plan</h1>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Plan Name *
          </label>
          <input
            type="text"
            name="name"
            value={plansForm.name}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Basic Plan"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price *
          </label>
          <input
            type="number"
            name="price"
            value={plansForm.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="0.00"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration *
          </label>
          <input
            type="number"
            name="duration"
            value={plansForm.duration}
            onChange={handleInputChange}
            required
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="1"
          />
        </div>

        {/* Duration Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration Type *
          </label>
          <select
            name="durationType"
            value={plansForm.durationType}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={plansForm.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={plansForm.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Plan description..."
          />
        </div>

        {/* Features */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Features (comma-separated)
          </label>
          <textarea
            name="features"
            value={plansForm.features}
            onChange={handleInputChange}
            rows="2"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Access to gym, Personal trainer, Group classes"
          />
        </div>

        {/* Buttons */}
        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            {isLoading ? "Saving..." : "Create Plan"}
          </button>
          <button
            type="button"
            onClick={() => setPlansForm(initialPlansState)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberShipPlans;
