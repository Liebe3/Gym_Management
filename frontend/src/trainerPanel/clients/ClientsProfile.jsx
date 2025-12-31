import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaDumbbell,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/ui/Loading";
import trainerService from "../../services/trainerService";

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":");
  const hour12 = hour % 12 || 12;
  const ampm = hour >= 12 ? "PM" : "AM";
  return `${hour12}:${minute} ${ampm}`;
};

const ClientsProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      const res = await trainerService.getClientById(id);
      if (res.success) {
        setClient(res.data);
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) return <Loading />;
  if (!client) return <div className="p-6 text-center">Client not found.</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200 cursor-pointer"
      >
        <FaArrowLeft className="text-sm" /> Back to Clients
      </motion.button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {client.user?.profilePicture ? (
              <img
                src={client.user.profilePicture}
                alt={`${client.user?.firstName} ${client.user?.lastName}`}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-emerald-500 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-emerald-500 shadow-md">
                {client.user?.firstName?.[0]}
                {client.user?.lastName?.[0]}
              </div>
            )}
          </motion.div>

          {/* Client Info */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {client.user?.firstName} {client.user?.lastName}
            </h2>
            <div className="mt-2 space-y-1">
              <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-emerald-500" />
                {client.user?.email}
              </p>
            </div>
            <div className="mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${
                  client.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
                {client.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-6 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaCreditCard className="text-emerald-500" />
            Membership Details
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Current Plan
              </p>
              <p className="font-semibold text-lg text-gray-900 dark:text-white">
                {client.membershipPlan?.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Duration
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {client.membershipPlan?.duration}{" "}
                {client.membershipPlan?.durationType}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Member Since
              </p>
              <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FaCalendarAlt className="text-emerald-500" />
                {formatDate(client.startDate)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Session */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-bold mb-6 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <FaClock className="text-emerald-500" />
            Upcoming Session
          </h3>

          {client.nextSession ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {new Date(client.nextSession.date).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  {formatTime(client.nextSession.startTime)} —{" "}
                  {formatTime(client.nextSession.endTime)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <FaClock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming sessions scheduled
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg"
      >
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FaDumbbell className="text-emerald-500" />
          Progress Tracking
        </h3>

        <div className="p-6 text-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <FaUser className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1">
            Progress Tracking Coming Soon
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Track workouts, measurements, goals & trainer notes here.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientsProfile;
