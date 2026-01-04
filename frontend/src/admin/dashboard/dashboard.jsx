import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend as ChartLegend,
  Tooltip as ChartTooltip,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Bar as ChartJSBar,
  Doughnut as ChartJSDoughnut,
  Line as ChartJSLine,
} from "react-chartjs-2";
import {
  FaBan,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaUsers,
  FaUserTimes,
} from "react-icons/fa";
import { FaPesoSign } from "react-icons/fa6";
import Loading from "../../components/ui/Loading";
import { showError } from "../../pages/utils/Alert";
import adminDashboardService from "../../services/AdminDashboardService";

import ChartCard from "./ChartCard";
import SessionCard from "./SessionCard";
import StatsCard from "./StatsCard";
import TrainerCard from "./TrainerCard";
import {
  createMemberStatusChartData,
  createMonthlyChartData,
  createRevenueChartData,
  createSessionStatusChartData,
  createWeeklyChartData,
  getChartOptions,
} from "./adminChartConfig";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await adminDashboardService.getAdminDashboard();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          showError("Failed to load dashboard");
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        showError("Error loading dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const {
    overview,
    monthlyChart,
    sessionStatusChart,
    memberStatusChart,
    revenueChart,
    weeklyChart,
    topTrainers,
    recentSessions,
  } = dashboardData;

  const stats = [
    {
      title: "Total Users",
      value: overview.totalUsers,
      icon: FaUsers,
      color: "blue",
    },
    {
      title: "Total Members",
      value: overview.totalMembers,
      icon: FaUserCheck,
      color: "green",
    },
    {
      title: "Total Trainers",
      value: overview.totalTrainers,
      icon: FaUserTimes,
      color: "purple",
    },
    {
      title: "Active Members",
      value: overview.activeMembers,
      icon: FaCheckCircle,
      color: "emerald",
    },
    {
      title: "Expired Members",
      value: overview.expiredMembers,
      icon: FaUserTimes,
      color: "red",
    },
    {
      title: "Total Revenue",
      value: overview.revenue,
      icon: FaPesoSign,
      color: "orange",
    },
    {
      title: "Total Sessions",
      value: overview.totalSessions,
      icon: FaCalendarAlt,
      color: "pink",
    },
    {
      title: "Completed",
      value: overview.completedSessions,
      icon: FaCheckCircle,
      color: "green",
    },
    {
      title: "Scheduled",
      value: overview.scheduledSessions,
      icon: FaClock,
      color: "blue",
    },
    {
      title: "Cancelled Sessions",
      value: overview.cancelledSessions,
      icon: FaBan,
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-emerald-600 mb-2">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Welcome to the Admin Dashboard. Here's your gym overview.
        </p>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Monthly Sessions Chart */}
        <ChartCard title="Sessions by Month (Last 6 Months)">
          <div className="h-80">
            <ChartJSLine
              data={createMonthlyChartData(monthlyChart)}
              options={getChartOptions()}
            />
          </div>
        </ChartCard>

        {/* Revenue Chart */}
        <ChartCard title="Revenue by Month (Last 6 Months)">
          <div className="h-80">
            <ChartJSLine
              data={createRevenueChartData(revenueChart)}
              options={getChartOptions()}
            />
          </div>
        </ChartCard>
      </motion.div>

      {/* Status Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Session Status Distribution */}
        <ChartCard title="Sessions by Status">
          <div className="h-80 flex items-center justify-center">
            <ChartJSDoughnut
              data={createSessionStatusChartData(sessionStatusChart)}
              options={getChartOptions(false)}
            />
          </div>
        </ChartCard>

        {/* Member Status Distribution */}
        <ChartCard title="Members by Status">
          <div className="h-80 flex items-center justify-center">
            <ChartJSDoughnut
              data={createMemberStatusChartData(memberStatusChart)}
              options={getChartOptions(false)}
            />
          </div>
        </ChartCard>
      </motion.div>

      {/* Weekly and Top Trainers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        {/* Weekly Distribution */}
        <ChartCard title="Weekly Distribution">
          <div className="h-80">
            <ChartJSBar
              data={createWeeklyChartData(weeklyChart)}
              options={getChartOptions()}
            />
          </div>
        </ChartCard>

        {/* Top Trainers */}
        <ChartCard title="Top Trainers">
          <div className="space-y-3">
            {topTrainers.length > 0 ? (
              topTrainers.map((trainer, index) => (
                <TrainerCard key={index} trainer={trainer} index={index} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No trainers yet
              </p>
            )}
          </div>
        </ChartCard>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <ChartCard title="Today's Scheduled Sessions">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentSessions.length > 0 ? (
              recentSessions.map((session, index) => (
                <SessionCard key={index} session={session} index={index} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No sessions scheduled for today
              </p>
            )}
          </div>
        </ChartCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;
