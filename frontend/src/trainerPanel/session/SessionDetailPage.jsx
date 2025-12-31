// SessionDetailPage.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaNotesMedical,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import sessionService from "../../services/sessionService";

import SessionInfoCard from "./SessionInfroCard";
import Loading from "../../components/ui/Loading";

const SessionDetailPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails();
    }
  }, [sessionId]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const response = await sessionService.getMySessionById(sessionId);
      if (response.success) {
        setSession(response.data);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
      navigate("/trainer/sessions");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
     <Loading />
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate("/trainer/sessions")}
            className="flex items-center text-emerald-400 mb-4 transition-colors cursor-pointer"
          >
            <FaArrowLeft className="mr-2" />
            Back to Sessions
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-emerald-600">
              Session Details
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                session.status
              )}`}
            >
              {session.status}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Information */}
          <SessionInfoCard
            icon={FaCalendarAlt}
            title="Session Information"
            delay={0.1}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {formatDate(session.date)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Start Time
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {formatTime(session.startTime)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  End Time
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {formatTime(session.endTime)}
                </span>
              </div>
            </div>
          </SessionInfoCard>

          {/* Client Information */}
          <SessionInfoCard icon={FaUser} title="Client Information" delay={0.2}>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {session.member.user.firstName} {session.member.user.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  <FaEnvelope className="mr-2 w-4 h-4" />
                  Email
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100">
                  {session.member.user.email}
                </span>
              </div>
            </div>
          </SessionInfoCard>

          {/* Session Notes */}
          <SessionInfoCard
            icon={FaNotesMedical}
            title="Session Notes"
            delay={0.3}
          >
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[100px]">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {session.notes || "No notes available for this session."}
              </p>
            </div>
          </SessionInfoCard>

          {/* Membership Information */}
          {session.member.membershipPlan && (
            <SessionInfoCard icon={FaUser} title="Membership Plan" delay={0.4}>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Plan
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {session.member.membershipPlan.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {session.member.membershipPlan.duration}{" "}
                    {session.member.membershipPlan.durationType}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Price
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                    ₱{session.member.membershipPlan.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </SessionInfoCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPage;
