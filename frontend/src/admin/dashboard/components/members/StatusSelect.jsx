const StatusSelect = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Status
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          disabled
            ? "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400"
            : "bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer"
        }`}
      >
        <option value="pending">Pending</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="none">None</option>
      </select>
    </div>
  );
};

export default StatusSelect;
