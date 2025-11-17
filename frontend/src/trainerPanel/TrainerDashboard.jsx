import { motion } from "framer-motion";
import { useEffect, useState } from "react";

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

import {
  Bar as ChartJSBar,
  Doughnut as ChartJSDoughnut,
  Line as ChartJSLine,
} from "react-chartjs-2";

import { FaCalendarAlt, FaCheckCircle, FaClock, FaUsers } from "react-icons/fa";
import Loading from "../components/ui/Loading";
import { showError } from "../pages/utils/Alert";
import dashboardService from "../services/dashboardService";
import TrainerLayout from "./components/TrainerLayout";

import ChartCard from "./dashboard/ChartCard";
import StatCard from "./dashboard/StatCard";
import ClientCard from "./dashboard/ClientCard";
import SessionCard from "./dashboard/SessionCard";

import {
  createMonthlyChartData,
  createStatusChartData,
  getChartOptions,
  createWeeklyChartData
} from "./dashboard/Chartconfig";

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

const TrainerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getTrainerDashboard();
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
    return (
      <TrainerLayout>
        <Loading />
      </TrainerLayout>
    );
  }

  if (!dashboardData) {
    return (
      <TrainerLayout>
        <div className="text-center py-10">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </TrainerLayout>
    );
  }

  const {
    overview,
    monthlyChart,
    statusChart,
    weeklyChart,
    upcomingSessions,
    topClients,
  } = dashboardData;

  const stats = [
    {
      title: "Total Clients",
      value: overview.activeClients,
      icon: FaUsers,
      color: "blue",
    },
    {
      title: "Total Sessions",
      value: overview.totalSessions,
      icon: FaCalendarAlt,
      color: "emerald",
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
      color: "yellow",
    },
  ];

  return (
    <TrainerLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-emerald-600 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome back! Here's your training overview.
          </p>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
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

          {/* Status Distribution */}
          <ChartCard title="Sessions by Status">
            <div className="h-80 flex items-center justify-center">
              <ChartJSDoughnut
                data={createStatusChartData(statusChart)}
                options={getChartOptions(false)}
              />
            </div>
          </ChartCard>
        </motion.div>

        {/* Weekly and Top Clients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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

          {/* Top Clients */}
          <ChartCard title="Top Clients">
            <div className="space-y-3">
              {topClients.length > 0 ? (
                topClients.map((client, index) => (
                  <ClientCard key={index} client={client} index={index} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No clients yet
                </p>
              )}
            </div>
          </ChartCard>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ChartCard title="Upcoming Sessions">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session, index) => (
                  <SessionCard key={index} session={session} index={index} />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  No upcoming sessions
                </p>
              )}
            </div>
          </ChartCard>
        </motion.div>
      </div>
    </TrainerLayout>
  );
};

export default TrainerDashboard;
