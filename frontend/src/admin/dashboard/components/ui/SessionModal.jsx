// SessionModal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FiX } from "react-icons/fi";
import SessionForm from "../session/SessionForm";

const SessionModal = ({
  isModalOpen,
  mode,
  selectedSession,
  handleCloseModal,
  onSuccess,
}) => {
  const handleSuccess = (response) => {
    onSuccess && onSuccess(response);
    handleCloseModal();
  };

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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
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
            <Dialog.Panel className="w-full max-w-3xl max-h-[90vh] overflow-auto rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="sticky z-10 top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl flex items-center justify-between">
                <Dialog.Title className="text-2xl font-bold text-emerald-600">
                  {mode === "create"
                    ? "Schedule New Session"
                    : mode === "update"
                    ? "Update Session"
                    : "Session Details"}
                </Dialog.Title>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <SessionForm
                  mode={mode}
                  selectedSession={selectedSession}
                  handleCloseModal={handleCloseModal}
                  onSuccess={handleSuccess}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SessionModal;
