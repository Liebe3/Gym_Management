const NotesInput = ({
  formData,
  handleChange,
  isViewMode,
  isDatePast,
  loading,
  selectedSession,
}) => {
  // For past sessions, allow notes editing unless session is finalized
  const shouldShowTextarea = !isViewMode;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Notes
      </label>
      {!shouldShowTextarea ? (
        <div className="p-3 bg-gray-50  dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 min-h-[100px]">
          <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
            {selectedSession?.notes || formData.notes || "No notes"}
          </p>
        </div>
      ) : (
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          disabled={loading}
          rows={4}
          placeholder="Add any notes about"
          className="w-full px-4 py-3 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
      )}
    </div>
  );
};

export default NotesInput;
