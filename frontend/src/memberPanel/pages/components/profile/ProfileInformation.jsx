import { motion } from "framer-motion";
import { useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiMail,
  FiSave,
  FiUser,
} from "react-icons/fi";
import memberProfileService from "../../../../services/memberPanel/memberProfileService";

const ProfileInformation = ({ initialData, onUpdateUser }) => {
  const [profileData, setProfileData] = useState(initialData);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleProfileSubmit = async () => {
    // Validation
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await memberProfileService.updateMemberProfile({
        firstName: profileData.firstName.trim(),
        lastName: profileData.lastName.trim(),
      });

      if (response.success) {
        setSuccessMessage("Profile updated successfully!");

        // Update context if available
        if (onUpdateUser) {
          onUpdateUser(response.data.user);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
          <FiUser className="text-emerald-600 dark:text-emerald-400 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Profile Information
        </h2>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <FiCheckCircle className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 dark:text-green-400 text-sm">
            {successMessage}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter last name"
            />
          </div>
        </div>

        {/* Email (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Email cannot be changed
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProfileSubmit}
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileInformation;
