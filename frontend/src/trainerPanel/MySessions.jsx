import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { FaClock, FaUserCheck, FaUsers, FaUserTimes } from "react-icons/fa";
import Loading from "../components/ui/Loading";
import { showError, showSuccess } from "../pages/utils/Alert";
import sessionService from "../services/sessionService";
import TrainerSessionForm from "./session/TrainerSessionForm";
import TrainerSessionModal from "./session/TrainerSessionModal";
import TrainerSessionsFilter from "./session/TrainerSessionsFilter";
import TrainerSessionsTable from "./session/TrainerSessionsTable ";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [statusCount, setStatusCount] = useState({});

  // Filters
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedSession, setSelectedSession] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch sessions
  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        limit: 10,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        search: debouncedSearch || undefined,
      };

      // Remove undefined values from filters
      Object.keys(filters).forEach(
        (key) => filters[key] === undefined && delete filters[key]
      );

      const response = await sessionService.getMySessions(filters);

      if (response.success) {
        setSessions(response.data || []);
        setPagination(response.pagination || {});

        // Extract status counts
        const counts = response.counts || response.filter?.counts || {};
        setStatusCount(counts);
      }
    } catch (error) {
      console.error("Fetch sessions error:", error);
      showError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, debouncedSearch]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Filter handlers
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedStatus !== "all" || debouncedSearch !== "";

  // Modal handlers
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedSession(null);
    setIsModalOpen(true);
  };

  const handleView = (session) => {
    setModalMode("view");
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleEdit = (session) => {
    setModalMode("update");
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  // fix this if the trainer can delete sessions
  // const handleDelete = async (sessionId) => {
  //   try {
  //     const result = await ShowWarning("This action cannot be undone");
  //     if (result.isConfirmed) {
  //       const response = await sessionService.deleteSession(sessionId);
  //       if (response.success) {
  //         showSuccess("Session deleted successfully");
  //         fetchSessions();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Delete session error:", error);
  //     showError(error.response?.data?.message || "Failed to delete session");
  //   }
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
  };

  const handleSuccess = async (sessionData) => {
    try {
      if (modalMode === "create") {
        const response = await sessionService.createMySession(sessionData);
        if (response.success) {
          showSuccess("Session scheduled successfully");
          fetchSessions();
          handleCloseModal();
        }
      } else if (modalMode === "update") {
        const response = await sessionService.updateMySession(
          selectedSession._id,
          sessionData
        );
        if (response.success) {
          showSuccess("Session updated successfully");
          fetchSessions();
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error("Session operation error:", error);
      showError(error.response?.data?.message || "Operation failed");
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-emerald-600 mb-2">
          My Sessions
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your training sessions with clients
        </p>
      </motion.div>

      {/* Stats Cards (Sessions) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Sessions
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {statusCount?.all ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Scheduled
              </p>
              <p className="text-3xl font-bold text-pink-600 dark:text-pink-600">
                {statusCount?.scheduled ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
              <FaUserCheck className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Completed
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {statusCount?.completed ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Cancelled
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {statusCount?.cancelled ?? 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <FaUserTimes className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Component */}
      <TrainerSessionsFilter
        selectedStatus={selectedStatus}
        handleStatusFilter={handleStatusFilter}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        clearFilters={clearFilters}
        statusCount={statusCount}
      />

      {/* Sessions Table */}
      <TrainerSessionsTable
        sessions={sessions}
        onEdit={handleEdit}
        // onDelete={handleDelete} // uncomment if delete is implemented
        onView={handleView}
        handleOpenCreate={handleOpenCreate}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
        pagination={pagination}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Modal */}
      <TrainerSessionModal
        isModalOpen={isModalOpen}
        mode={modalMode}
        selectedSession={selectedSession}
        handleCloseModal={handleCloseModal}
        onSuccess={handleSuccess}
      >
        <TrainerSessionForm
          onSubmit={handleSuccess}
          onCancel={handleCloseModal}
          loading={loading}
          mode={modalMode}
          selectedSession={selectedSession}
        />
      </TrainerSessionModal>
    </div>
  );
};

export default MySessions;
