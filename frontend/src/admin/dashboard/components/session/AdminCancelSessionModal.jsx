import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";
import { formatTimeAMPM } from "../../../../memberPanel/pages/utils/formatTime";
import sessionService from "../../../../services/sessionService";

const AdminCancelSessionModal = ({
  isModalOpen,
  session,
  handleCloseModal,
  onSuccess,
}) => {
  const [cancellationReason, setCancellationReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!session) return null;

  const handleCancel = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await sessionService.cancelSession(session._id, cancellationReason);

      // Reset form
      setCancellationReason("");
      handleCloseModal();

      // Call success callback to refresh sessions
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to cancel session. Please try again.";
      setError(errorMessage);
      console.error("Error cancelling session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseWithReset = () => {
    setCancellationReason("");
    setError(null);
    handleCloseModal();
  };

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseWithReset}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Centered Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Dialog.Title className="text-2xl font-bold text-red-600 dark:text-red-400">
                      Cancel Session
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Are you sure you want to cancel this session?
                    </p>
                  </div>

                  <button
                    onClick={handleCloseWithReset}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Warning Alert */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 dark:text-red-300">
                      Important
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Once cancelled, the member and trainer will be notified
                      and the session will need to be rescheduled if required.
                    </p>
                  </div>
                </div>

                {/* Session Details */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Session Details
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Trainer:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {session.trainer?.user
                          ? `${session.trainer.user.firstName} ${session.trainer.user.lastName}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Member:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {session.member?.user
                          ? `${session.member.user.firstName} ${session.member.user.lastName}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Date:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(session.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Time:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatTimeAMPM(session.startTime)} –{" "}
                        {formatTimeAMPM(session.endTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 dark:text-red-300">
                        Error
                      </h4>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancellation Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Reason for Cancellation{" "}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please provide a reason for cancelling this session..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      placeholder-gray-400 dark:placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400
                      resize-none"
                    rows="4"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This will be shown to the member and trainer
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleCloseWithReset}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                      text-gray-700 dark:text-gray-300 font-medium
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Keep Session
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700
                      text-white font-medium transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      "Confirm Cancellation"
                    )}
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AdminCancelSessionModal;
