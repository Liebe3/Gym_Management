import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  FiAward,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiUser,
} from "react-icons/fi";
import { formatDate, formatTimeAMPM } from "../../../utils/formatTime";

const ViewUpcomingSessionModal = ({
  isModalOpen,
  session,
  handleCloseModal,
}) => {
  if (!session) return null;

  return (
    <Transition show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
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
                    <Dialog.Title className="text-2xl font-bold text-emerald-600">
                      Session Details
                    </Dialog.Title>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Details for your scheduled session
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer   "
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status
                  </h3>
                  <span
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                    bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300"
                  >
                    <FiClock className="w-4 h-4" />
                    Scheduled
                  </span>
                </div>

                {/* Trainer Info */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Trainer Information
                  </h3>

                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 dark:bg-emerald-900/40 rounded-full p-3">
                      <FiUser className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Your Trainer
                      </p>

                      <p className="font-semibold text-gray-900 dark:text-white">
                        {session.trainer?.user?.firstName}{" "}
                        {session.trainer?.user?.lastName}
                      </p>

                      {session.trainer?.specializations?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {session.trainer.specializations
                            .slice(0, 2)
                            .map((spec, index) => (
                              <span
                                key={index}
                                className="bg-emerald-100 dark:bg-emerald-900/40
                                  text-emerald-700 dark:text-emerald-300
                                  text-xs font-semibold px-2.5 py-1 rounded-full"
                              >
                                {spec}
                              </span>
                            ))}

                          {session.trainer.specializations.length > 2 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 px-2.5 py-1">
                              +{session.trainer.specializations.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {session.trainer?.experience && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <FiAward className="inline-block w-3 h-3 mr-1" />
                          {session.trainer.experience} year
                          {session.trainer.experience > 1 ? "s" : ""} experience
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    Date & Time
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiCalendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Date
                        </p>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                          {formatDate(session.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FiClock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          Time
                        </p>
                        <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                          {formatTimeAMPM(session.startTime)} –{" "}
                          {formatTimeAMPM(session.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {session.notes && (
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <FiMessageSquare className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Session Notes
                      </h3>
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 leading-relaxed">
                      {session.notes}
                    </p>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewUpcomingSessionModal;
