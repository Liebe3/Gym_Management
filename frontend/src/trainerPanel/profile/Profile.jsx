import { useEffect, useState } from "react";
import { FiAward, FiClock, FiUser } from "react-icons/fi";

import Loading from "../../components/ui/Loading";

import EditProfileForm from "./EditProfileForm";

import trainerService from "../../services/trainerService";

import ProfileHeader from "./ProfileHeader";
import SpecializationsDisplay from "./SpecializationsDisplay";
import TrainerInfo from "./TrainerInfo";
import InfoCard from "./TrainerInfoCard";
import WorkScheduleDisplay from "./WorkScheduleDisplay";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrainerProfile();
  }, []);

  const loadTrainerProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await trainerService.getMyProfile();
      setTrainer(response.data);

      setTrainer(response.data);
    } catch (error) {
      setError(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      setLoading(true);

      const response = await trainerService.updateMyProfile(updatedData);
      setTrainer(response.trainer);

      setIsEditing(false);
      console.log("Profile updated successfully!");
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !trainer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  if (error && !trainer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadTrainerProfile}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          No trainer profile found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <ProfileHeader
          trainer={trainer}
          onEditClick={() => setIsEditing(true)}
          isEditing={isEditing}
        />

        {isEditing ? (
          <EditProfileForm
            trainer={trainer}
            onSave={handleSaveEdit}
            onCancel={() => {
              setIsEditing(false);
              loadTrainerProfile();
            }}
            loading={loading}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InfoCard icon={FiUser} title="Basic Information" delay={0.1}>
              <TrainerInfo trainer={trainer} />
            </InfoCard>
            <InfoCard icon={FiAward} title="Specializations" delay={0.2}>
              <SpecializationsDisplay
                specializations={trainer.specializations}
              />
            </InfoCard>
            <div className="lg:col-span-2">
              <InfoCard icon={FiClock} title="Work Schedule" delay={0.3}>
                <WorkScheduleDisplay schedule={trainer.workSchedule} />
              </InfoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
