const GenderSelect = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Gender
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-emerald-500
    ${
      disabled
        ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400 cursor-not-allowed"
        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
    }`}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    </div>
  );
};

export default GenderSelect;
