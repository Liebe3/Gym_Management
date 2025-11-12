import { FiActivity, FiMail, FiUser } from "react-icons/fi";

const TrainerClientSelect = ({
  formData,
  clients,
  handleChange,
  errors,
  loading,
  isViewMode,
  selectedSession,
  mode,
}) => {
  const getClientName = (client) => {
    if (!client?.user) return "Unknown";
    return `${client.user.firstName} ${client.user.lastName}`;
  };

  const getClientEmail = (client) => {
    return client?.user?.email || "";
  };

  const getMembershipInfo = (client) => {
    if (!client?.membershipPlan) return null;
    return client.membershipPlan;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Client <span className="text-red-500">*</span>
      </label>

      {isViewMode ? (
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <FiUser className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-800 dark:text-gray-200">
            {selectedSession?.member
              ? getClientName(selectedSession.member)
              : "N/A"}
          </span>
        </div>
      ) : (
        <select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          disabled={loading || clients.length === 0 || mode === "update"}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
            errors.memberId
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Choose a client...</option>
          {clients.map((client) => {
            const membership = getMembershipInfo(client);
            return (
              <option key={client._id} value={client._id}>
                {getClientName(client)}
                {membership ? ` - ${membership.name}` : ""}
              </option>
            );
          })}
        </select>
      )}

      {errors.memberId && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <span className="mr-1">⚠</span>
          {errors.memberId}
        </p>
      )}

      {/* Selected Client Details */}
      {(formData.memberId || (isViewMode && selectedSession?.member)) && (
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          {(() => {
            const selectedClient = isViewMode
              ? selectedSession?.member
              : clients.find((c) => c._id === formData.memberId);

            if (!selectedClient) return null;

            const membership = getMembershipInfo(selectedClient);

            return (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-3">
                  Client Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Name */}
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Name
                      </p>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {getClientName(selectedClient)}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Email
                      </p>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                        {getClientEmail(selectedClient)}
                      </p>
                    </div>
                  </div>

                  {/* Membership Plan */}
                  {membership && (
                    <div className="flex items-center space-x-2 md:col-span-2">
                      <FiActivity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">
                          Membership Plan
                        </p>
                        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                          {membership.name} - {membership.duration}{" "}
                          {membership.durationType}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default TrainerClientSelect;
