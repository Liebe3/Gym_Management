const ExperienceInput = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Experience (years)
      </label>
      <input
        type="number"
        min="0"
        required
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white outline-emerald-500"
      />
    </div>
  );
};

export default ExperienceInput;
