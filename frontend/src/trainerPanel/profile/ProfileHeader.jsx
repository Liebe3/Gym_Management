import { motion } from "framer-motion";
import { FiAward, FiCalendar, FiEdit, FiUser } from "react-icons/fi";

import StatusBadge from "../../admin/dashboard/components/trainer/StatusBadge";

const ProfileHeader = ({ trainer, onEditClick, isEditing }) => {
  const userName =
    trainer.user?.firstName && trainer.user?.lastName
      ? `${trainer.user.firstName} ${trainer.user.lastName}`
      : trainer.user?.firstName || trainer.user?.lastName || "Trainer Name";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 rounded-xl shadow-lg p-8 mb-6"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="relative">
          <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl">
            {trainer.user?.profilePicture ? (
              <img
                src={trainer.user.profilePicture}
                alt={userName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <FiUser className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-400 rounded-full border-4 border-white dark:border-gray-800"></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-white mb-2">{userName}</h1>
          <p className="text-emerald-100 mb-3">
            {trainer.user?.email || "email@example.com"}
          </p>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <StatusBadge status={trainer.status} />
            <div className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <FiAward className="w-4 h-4 mr-1.5" />
              {trainer.experience} {trainer.experience === 1 ? "Year" : "Years"}
            </div>
            <div
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                trainer.isAvailableForNewClients
                  ? "bg-emerald-400/90 text-emerald-900"
                  : "bg-red-400/90 text-red-900"
              }`}
            >
              <FiCalendar className="w-4 h-4 mr-1.5" />
              {trainer.isAvailableForNewClients ? "Available" : "Unavailable"}
            </div>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-lg font-medium hover:bg-emerald-50 dark:hover:bg-gray-700 transition shadow-lg cursor-pointer"
          >
            <FiEdit className="w-4 h-4 " />
            Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
