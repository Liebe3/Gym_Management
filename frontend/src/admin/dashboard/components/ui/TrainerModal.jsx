import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import TrainerForm, { formModes } from "../trainer/TrainerForm";

const TrainerModal = ({
  isOpen,
  onClose,
  mode = formModes.Create,
  trainerId = null,
  onSuccess,
}) => {
  const handleSuccess = (response) => {
    onSuccess && onSuccess(response);
    onClose();
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
            <Dialog.Panel className="w-full max-w-6xl max-h-[90vh] overflow-auto rounded-xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Modal Header */}
              <div className="sticky z-10 top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 rounded-t-xl flex items-center justify-between">
                <Dialog.Title className="text-2xl font-bold text-emerald-600">
                  {mode === formModes.Create
                    ? "Create Trainer"
                    : mode === formModes.Update
                    ? "Update Trainer"
                    : "View Trainer"}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200 cursor-pointer"
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

              {/* Form Content */}
              <div className="p-6">
                <TrainerForm
                  mode={mode}
                  trainerId={trainerId}
                  onClose={onClose}
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

export default TrainerModal;
