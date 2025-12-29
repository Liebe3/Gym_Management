import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiBook,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/ui/Loading";
import AuthContext from "../../pages/context/AuthContext";
import memberHomeService from "../../services/memberPanel/memberHomeService";

import MemberShipDetails from "./components/home/MemberShipDetails";
import MembershipStatusCard from "./components/home/MembershipStatusCard";
import RecentSession from "./components/home/RecentSession";
import StatCard from "./components/home/StatCard";
import TopTrainers from "./components/home/TopTrainers";
import TrainerCard from "./components/home/TrainerCard";
import UpcomingSessions from "./components/home/UpcommingSessions";

import TrainerProfileModal from "./components/home/TrainerProfileModal";

const MemberHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (!user) return; // wait until user is loaded

    const fetchMemberData = async () => {
      try {
        setLoading(true);

        const response = await memberHomeService.getMemberHomeData();

        setData(response.data || response);
        setError(null);
      } catch (err) {
        console.error("Error fetching member home data:", err);
        setError("Failed to load member data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [user]);

  const handleViewProfile = (trainer) => {
    setSelectedTrainer(trainer);
    setShowProfileModal(true);
  };

  const handleBookSession = () => {
    navigate("/member/session");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-4">
            <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 text-xl" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-300">
                Error
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { member, membershipStatus, sessions, stats } = data || {};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Here's your fitness journey at a glance
        </p>
      </div>

      {/* Membership Status Banner */}
      {membershipStatus && (
        <div className="flex justify-between items-center" >
          <MembershipStatusCard status={membershipStatus} />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookSession}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiBook className="w-5 h-5" />
            Book Session
          </motion.button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8">
        <StatCard
          title="Total Sessions"
          value={stats?.totalSessions}
          valueColor="text-blue-600 dark:text-blue-600"
          icon={
            <FiCalendar className="text-blue-400 dark:text-blue-600  text-4xl" />
          }
        />
        <StatCard
          title="Completed"
          value={stats?.completedSessions}
          valueColor="text-green-600 dark:text-green-400"
          icon={
            <FiCheckCircle className="text-green-500 dark:text-green-400 text-4xl" />
          }
        />
        <StatCard
          title="Upcoming"
          value={stats?.upcomingCount}
          valueColor="text-yellow-600 dark:text-yellow-400"
          icon={
            <FiClock className="text-yellow-600 dark:text-yellow-400 text-4xl" />
          }
        />

        {member?.primaryTrainer ? (
          <TrainerCard trainer={member.primaryTrainer} />
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm p-6 border border-yellow-200 dark:border-yellow-800">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <FiAlertCircle className="text-yellow-600 dark:text-yellow-400 text-2xl" />
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">
                No Trainer Assigned
              </h3>
            </div>
          </div>
        )}
      </div>

      {/* Top Trainers*/}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            🏆 Top Trainers
          </h2>
          {data?.topTrainers && data.topTrainers.length > 0 ? (
            <TopTrainers
              trainers={data.topTrainers}
              onViewProfile={handleViewProfile}
            />
          ) : (
            <div className="text-center py-8">
              <FiAlertCircle className="mx-auto text-3xl text-gray-400 dark:text-gray-600 mb-3" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                No trainers available at the moment
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Check back later for available trainers
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Membership Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MemberShipDetails member={member} />
        </div>

        {/* Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Sessions
            </h2>
            <UpcomingSessions sessions={sessions?.upcoming} />
          </div>

          {/* Recent Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Recent Sessions
            </h2>
            <RecentSession sessions={sessions?.recent} />
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && selectedTrainer && (
        <TrainerProfileModal
          trainer={selectedTrainer}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedTrainer(null);
          }}
        />
      )}
    </div>
  );
};

export default MemberHome;
