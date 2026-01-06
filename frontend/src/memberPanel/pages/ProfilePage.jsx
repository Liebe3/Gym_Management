import { useContext, useEffect, useState } from "react";
import AuthContext from "../../pages/context/AuthContext";
import memberProfileService from "../../services/memberPanel/memberProfileService";
import ChangePassword from "./components/profile/ChangePassword";
import ProfileInformation from "./components/profile/ProfileInformation";

import Loading from "../../components/ui/Loading";

const ProfilePage = () => {
  const { updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await memberProfileService.getMemberProfile();

        if (response.success && response.data) {
          const userData = response.data.user;
          setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <Loading/>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account information
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Profile Information Component */}
        <ProfileInformation
          initialData={profileData}
          onUpdateUser={updateUser}
        />

        {/* Change Password Component */}
        <ChangePassword />
      </div>
    </div>
  );
};

export default ProfilePage;
