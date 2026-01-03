import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { MdFitnessCenter } from "react-icons/md";
import Loading from "../../components/ui/Loading";

import memberSessionService from "../../services/memberPanel/memberSessionService";
import AssignedTrainers from "./components/session/AssignedTrainers";
import BookSessionModal from "./components/session/components/BookSessionModal";
import MemberFilterSession from "./components/session/MemberFilterSession";
import MemberTableSession from "./components/session/MemberTableSession";

const MemberSession = () => {
  const [trainers, setTrainers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sessionCount, setSessionCount] = useState({});
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  });

  // Load sessions function with pagination
  const loadSessions = async (page = 1) => {
    try {
      const response = await memberSessionService.getUpcomingSessions(page, 10);
      setSessions(response.data || []);
      setPagination(
        response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10,
        }
      );
      setError(null);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setError("Failed to load sessions. Please try again.");
    }
  };

  // Fetch trainers and sessions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const trainersData = await memberSessionService.getAssignedTrainers();
        setTrainers(trainersData || []);

        await loadSessions(currentPage);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Filter sessions based on trainer selection and search term
  useEffect(() => {
    let filtered = sessions;

    // Filter by trainer
    if (selectedTrainer !== "all") {
      filtered = filtered.filter(
        (session) => session.trainer?._id === selectedTrainer
      );
    }

    // Filter by search term (trainer name)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((session) => {
        const trainerName =
          `${session.trainer?.user?.firstName} ${session.trainer?.user?.lastName}`.toLowerCase();
        return trainerName.includes(searchLower);
      });
    }

    setFilteredSessions(filtered);

    // Calculate session counts for each trainer
    const counts = { all: sessions.length };
    trainers.forEach((trainer) => {
      counts[trainer._id] = sessions.filter(
        (session) => session.trainer?._id === trainer._id
      ).length;
    });
    setSessionCount(counts);
  }, [sessions, selectedTrainer, searchTerm, trainers]);

  const handleTrainerFilter = (trainerId) => {
    setSelectedTrainer(trainerId);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const clearFilters = () => {
    setSelectedTrainer("all");
    setSearchTerm("");
  };

  const hasActiveFilters = selectedTrainer !== "all" || searchTerm !== "";

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
          My Session
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          See who you're training with and your assigned coach
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-4">
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
      )}

      {/* Assigned Trainers Section */}
      {trainers.length > 0 && (
        <div className="mb-12">
          <div className="flex text-2xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">
            <h2 className="mr-2">
              {trainers.length > 1 ? `Your Trainers` : `Your Trainer`}
            </h2>
            <MdFitnessCenter size={30} />
          </div>
          <AssignedTrainers trainers={trainers} />
        </div>
      )}

      {/* Upcoming Sessions Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            Upcoming Sessions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {pagination.totalRecords} session
            {pagination.totalRecords !== 1 ? "s" : ""} scheduled
          </p>
        </div>

        {/* Filter */}
        <MemberFilterSession
          selectedTrainer={selectedTrainer}
          handleTrainerFilter={handleTrainerFilter}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          trainers={trainers}
          sessionCount={sessionCount}
        />

        {/* Table */}
        <MemberTableSession
          sessions={filteredSessions}
          onBookSession={() => setIsBookModalOpen(true)}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          onSessionsUpdated={() => loadSessions(currentPage)}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
        />
      </div>

      {/* Book Session Modal */}
      <BookSessionModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={() => {
          setIsBookModalOpen(false);
          loadSessions(currentPage);
        }}
      />
    </div>
  );
};

export default MemberSession;
