import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaCreditCard, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ClientCard = ({ client, getStatusBadge }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNextSession = (session) => {
    if (!session) return "No upcoming session";

    const date = new Date(session.date);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    // Convert 24h to 12h format
    const [hour, minute] = session.startTime.split(":");
    const hour12 = hour % 12 || 12;
    const ampm = hour >= 12 ? "PM" : "AM";

    return `${dateStr} at ${hour12}:${minute} ${ampm}`;
  };

  const handleViewProfile = () => {
    navigate(`/trainer/clients/${client._id}`);
  };

  const handleViewSessions = () => {
    navigate(`/trainer/sessions/${client.nextSession._id}`);
  };

  return (
    <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
      {/* Client Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          {client.user?.profilePicture ? (
            <img
              src={client.user.profilePicture}
              alt={`${client.user.firstName} ${client.user.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center border-2 border-emerald-500">
              <span className="text-white font-bold text-xl">
                {client.user?.firstName?.[0]}
                {client.user?.lastName?.[0]}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {client.user?.firstName} {client.user?.lastName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {client.user?.email}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
            client.status
          )}`}
        >
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </span>
      </div>

      {/* Client Details */}
      <div className="space-y-3 mb-4">
        {/* Membership Plan */}
        <div className="flex items-start space-x-3">
          <FaCreditCard className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              Membership Plan
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {client.membershipPlan?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {client.membershipPlan?.duration}{" "}
              {client.membershipPlan?.durationType}
            </p>
          </div>
        </div>

        {/* Joined Date */}
        <div className="flex items-start space-x-3">
          <FaCalendarAlt className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              Joined Date
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatDate(client.startDate)}
            </p>
          </div>
        </div>

        {/* Next Session */}
        <div className="flex items-start space-x-3">
          <FaClock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              Next Session
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatNextSession(client.nextSession)}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewProfile}
          className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer"
        >
          <FaEye className="w-4 h-4 mr-1.5" />
          Profile
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleViewSessions}
          disabled={!client.nextSession}
          className={`flex-1 flex items-center justify-center px-3 py-2 border rounded-lg transition-colors text-sm font-medium cursor-pointer ${
            client.nextSession
              ? "border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              : "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
          }`}
        >
          <FaCalendarAlt className="w-4 h-4 mr-1.5" />
          {client.nextSession ? "View Session" : "No Sessions"}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClientCard;
