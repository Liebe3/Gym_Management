import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import sessionService from "../../../services/sessionService";
import SessionFilter from "./session/SessionFilter";
import SessionTable from "./session/SessionTable";
import SessionModal from "./ui/SessionModal";
import AdminCancelSessionModal from "./session/AdminCancelSessionModal";

const SessionSection = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Cancel modal state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // Load sessions
  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit,
      };

      if (selectedStatus && selectedStatus !== "all") {
        filters.status = selectedStatus;
      }

      if (selectedTrainer && selectedTrainer !== "all") {
        filters.trainer = selectedTrainer;
      }

      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch.trim();
      }

      const response = await sessionService.getAllSessions(filters);

      if (response.success) {
        setSessions(response.data || []);
        setPagination(response.pagination || {});
        setStatusCount(response.filter?.counts?.status || {});
      } else {
        setError(response.message || "Failed to fetch sessions");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [selectedStatus, selectedTrainer, debouncedSearch, currentPage]);

  // Handle status filter
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handle trainer filter
  const handleTrainerFilter = (trainerId) => {
    setSelectedTrainer(trainerId);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedStatus("all");
    setSelectedTrainer("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Open create modal
  const handleOpenCreate = () => {
    setMode("create");
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleOpenEdit = (session) => {
    setMode("update");
    setIsModalOpen(true);
    setSelectedSession(session);
  };

  // Open view modal
  const handleView = (session) => {
    setMode("view");
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  // Handle cancel session
  const handleCancel = (session) => {
    setSelectedSession(session);
    setIsCancelModalOpen(true);
  };

  // Handle close cancel modal
  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
    setSelectedSession(null);
  };

  // Handle cancellation success
  const handleCancellationSuccess = async () => {
    setIsCancelModalOpen(false);
    setSelectedSession(null);
    showSuccess("Session cancelled successfully");
    await loadSessions();
  };

  // Delete session
  const handleDelete = async (sessionId) => {
    try {
      const result = await ShowWarning("This action cannot be undone");
      if (result.isConfirmed) {
        await sessionService.deleteSession(sessionId);
        showSuccess("Session has been deleted");
        await loadSessions();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      showError("Failed to delete the session");
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMode("create");
    setSelectedSession(null);
  };

  // Success handler
  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
    loadSessions();
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time helper
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-evenly">
        <p className="text-emerald-600 font-bold text-xl tracking-wide animate-pulse mt-5">
          Fetching sessions...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we load the available sessions
        </p>
        <div className="mt-[-100px]">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  const hasActiveFilters =
    selectedStatus !== "all" ||
    selectedTrainer !== "all" ||
    debouncedSearch !== "";

  return (
    <div className="w-full">
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">
            Training Sessions
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and schedule training sessions
          </p>
        </motion.div>

        {/* Filter */}
        <SessionFilter
          selectedStatus={selectedStatus}
          handleStatusFilter={handleStatusFilter}
          selectedTrainer={selectedTrainer}
          handleTrainerFilter={handleTrainerFilter}
          // searchTerm={searchTerm}
          // handleSearch={handleSearch}
          clearFilters={clearFilters}
          statusCount={statusCount}
          debouncedSearch={debouncedSearch}
          // handleOpenCreate={handleOpenCreate} // Add this prop
        />

        {/* Table */}
        <SessionTable
          sessions={sessions}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onView={handleView}
          onCancel={handleCancel}
          handleOpenCreate={handleOpenCreate}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          formatDate={formatDate}
          formatDateTime={formatDateTime}
        />

        {/* Session Modal */}
        <SessionModal
          isModalOpen={isModalOpen}
          mode={mode}
          selectedSession={selectedSession}
          handleCloseModal={handleCloseModal}
          onSuccess={handleSuccess}
        />

        {/* Cancel Session Modal */}
        <AdminCancelSessionModal
          isModalOpen={isCancelModalOpen}
          session={selectedSession}
          handleCloseModal={handleCloseCancelModal}
          onSuccess={handleCancellationSuccess}
        />
      </div>
    </div>
  );
};

export default SessionSection;
