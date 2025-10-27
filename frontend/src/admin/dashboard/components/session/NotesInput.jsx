const NotesInput = ({
  formData,
  handleChange,
  isViewMode,
  loading,
  selectedSession,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Notes
    </label>
    {isViewMode ? (
      <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-gray-800 dark:text-gray-200">
          {selectedSession?.notes || "No notes"}
        </p>
      </div>
    ) : (
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        disabled={loading}
        rows={4}
        placeholder="Add any notes about the session..."
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
      />
    )}
  </div>
);

export default NotesInput;
