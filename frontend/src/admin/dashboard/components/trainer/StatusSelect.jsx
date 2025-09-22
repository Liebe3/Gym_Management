const StatusSelect = ({ value, onChange, disabled }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Status
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg outline-emerald-500
    ${
      disabled
        ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-400 cursor-not-allowed"
        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
    }`}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="on_leave">On Leave</option>
        <option value="terminated">Terminated</option>
      </select>
    </div>
  );
};

export default StatusSelect;
