import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FaCheck, FaSave, FaTimes } from "react-icons/fa";

const SessionNotesModal = ({ session, isOpen, onClose, onSave }) => {
  const [notes, setNotes] = useState(session?.notes || "");
  const [status, setStatus] = useState(session?.status || "scheduled");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(session._id, { notes, status });
      onClose();
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hour, minute] = time24.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Session Notes
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {session?.member?.user?.firstName}{" "}
                  {session?.member?.user?.lastName} •{" "}
                  {formatDate(session?.date)} at{" "}
                  {formatTime(session?.startTime)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Session Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Status
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStatus("scheduled")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      status === "scheduled"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300"
                    }`}
                  >
                    Scheduled
                  </button>
                  <button
                    onClick={() => setStatus("completed")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      status === "completed"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-300"
                    }`}
                  >
                    <FaCheck className="inline mr-1" /> Completed
                  </button>
                  <button
                    onClick={() => setStatus("cancelled")}
                    className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                      status === "cancelled"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                        : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-300"
                    }`}
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this session (exercises performed, client progress, observations, etc.)"
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {notes.length} characters
                </p>
              </div>

              {/* Quick Templates */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quick Templates
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setNotes(notes + "\n\nExercises: \n• ")}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    + Exercises
                  </button>
                  <button
                    onClick={() => setNotes(notes + "\n\nProgress: ")}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    + Progress
                  </button>
                  <button
                    onClick={() => setNotes(notes + "\n\nNext Session Goals: ")}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    + Goals
                  </button>
                  <button
                    onClick={() => setNotes(notes + "\n\nClient Feedback: ")}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    + Feedback
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Notes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SessionNotesModal;
