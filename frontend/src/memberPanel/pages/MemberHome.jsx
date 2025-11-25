import { useContext, useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import Loading from "../../components/ui/Loading";
import AuthContext from "../../pages/context/AuthContext";
import memberHomeService from "../../services/memberPanel/memberHomeService";

import MemberShipDetails from "./components/MemberShipDetails";
import MembershipStatusCard from "./components/MembershipStatusCard";
import RecentSession from "./components/RecentSession";
import StatCard from "./components/StatCard";
import TopTrainers from "./components/TopTrainers";
import TrainerCard from "./components/TrainerCard";
import UpcomingSessions from "./components/UpcommingSessions";

const MemberHome = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      {membershipStatus && <MembershipStatusCard status={membershipStatus} />}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        {member?.trainer && <TrainerCard trainer={member.trainer} />}
      </div>

      {/* Top Trainers*/}
      {data?.topTrainers && data.topTrainers.length > 0 && (
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              🏆 Top Trainers
            </h2>
            <TopTrainers trainers={data.topTrainers} />
          </div>
        </div>
      )}

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
    </div>
  );
};

export default MemberHome;
