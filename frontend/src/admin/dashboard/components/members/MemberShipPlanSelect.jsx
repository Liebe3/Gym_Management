const MembershipPlanSelect = ({
  value,
  onChange,
  disabled,
  membershipPlans = [],
  planLoading = false,
}) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Membership Plan
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled}
        className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400"
            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
        }`}
      >
        <option value="">Select a plan</option>
        {Array.isArray(membershipPlans) && membershipPlans.length > 0 ? (
          membershipPlans.map((plan) => (
            <option key={plan._id} value={plan._id}>
              {plan.name} - ${plan.price} ({plan.duration} {plan.durationType})
            </option>
          ))
        ) : (
          <option disabled>No plans available</option>
        )}
      </select>
      {!planLoading && membershipPlans.length === 0 && (
        <p className="text-xs text-red-500 mt-1">No membership plans loaded.</p>
      )}
    </div>
  );
};

export default MembershipPlanSelect;
