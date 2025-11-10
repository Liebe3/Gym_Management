import { FiUser } from "react-icons/fi";

const MemberSelect = ({
  formData,
  members,
  handleChange,
  errors,
  isViewMode,
  loading,
  selectedSession,
}) => {
  const getMemberName = (member) =>
    member?.user ? `${member.user.firstName} ${member.user.lastName}` : "Unknown";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Member <span className="text-red-500">*</span>
      </label>
      {isViewMode ? (
        <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <FiUser className="w-5 h-5 text-gray-500 mr-2" />
          <span className="text-gray-800 dark:text-gray-200">
            {selectedSession?.member ? getMemberName(selectedSession.member) : "N/A"}
          </span>
        </div>
      ) : (
        <select
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          disabled={loading}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border ${
            errors.memberId ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          } rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Select a member</option>
          {members.map((m) => (
            <option key={m._id} value={m._id}>
              {getMemberName(m)}
              {m.membershipPlan && ` - ${m.membershipPlan.name}`}
            </option>
          ))}
        </select>
      )}
      {errors.memberId && <p className="mt-1 text-sm text-red-500">{errors.memberId}</p>}
    </div>
  );
};

export default MemberSelect;