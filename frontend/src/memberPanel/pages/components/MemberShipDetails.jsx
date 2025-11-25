import { formatDate } from "../utils/formatTime";

const MemberShipDetails = ({ member }) => {
  if (!member) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No membership details available
      </p>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Membership
      </h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {member?.membershipPlan?.name || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {member?.membershipPlan?.duration}{" "}
            {member?.membershipPlan?.durationType}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {member?.startDate ? formatDate(member.startDate) : "N/A"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
          <p className="font-semibold text-gray-900 dark:text-white">
            {member?.endDate ? formatDate(member.endDate) : "N/A"}
          </p>
        </div>

        {member?.membershipPlan?.price && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ₱{member.membershipPlan.price}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberShipDetails;
