import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import trainerService from "../../../services/trainerService";
import TrainerFilter from "./trainer/TrainerFilter";
import TrainerTable from "./trainer/TrainerTable";
import TrainerModal from "./ui/TrainerModal";

const TrainerSection = () => {
  const [trainers, setTrainers] = useState([]);
  // const [trainerStats, setTrainerStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Load trainers with filters
  const loadTrainers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit,
        all: true, // Add this to get stats for all trainers
      };

      if (selectedStatus !== "all") {
        filters.status = selectedStatus;
      }

      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch.trim();
      }

      const response = await trainerService.getAllTrainer(filters);

      if (response.success) {
        setTrainers(response.data || []);
        setPagination(response.pagination || {});
        setStatusCount(response.filter?.counts?.status || {});
      } else {
        setError(response.message || "Failed to fetch trainers");
      }
    } catch (error) {
      console.error("Error fetching trainers:", error);
      setError("Failed to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  // const loadTrainerStats = async (trainerId) => {
  //   try {
  //     const response = await trainerService.getTrainerStats(trainerId);
  //     if (response.success) {
  //       setTrainerStats(response.data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching trainer stats", error);
  //   }
  // };

  // Handle status filter change
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // Handle search debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load trainers when dependencies change
  useEffect(() => {
    loadTrainers();
  }, [debouncedSearch, selectedStatus, currentPage]);

  const handleView = (trainerId) => {
    // loadTrainerStats(trainerId);
    setMode("view");
    setSelectedTrainer(trainerId);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedTrainer(null);
    setMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trainerId) => {
    setMode("update");
    setIsModalOpen(true);
    setSelectedTrainer(trainerId);
  };

  const handleDelete = async (trainerId) => {
    try {
      const result = await ShowWarning("This action cannot be undone");
      if (result.isConfirmed) {
        await trainerService.deleteTrainer(trainerId);
        showSuccess("Trainer has been deleted");
        await loadTrainers();
      }
    } catch (error) {
      console.error("Error deleting trainer:", error);
      showError("Failed to delete the trainer");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMode("create");
    setSelectedTrainer(null);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedTrainer(null);
    loadTrainers();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-evenly">
        <p className="text-emerald-600 font-bold text-xl tracking-wide animate-pulse mt-5">
          Fetching trainers...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we load the available trainers
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

  const hasActiveFilters = selectedStatus !== "all" || debouncedSearch !== "";

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
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">Trainers</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize your trainers
          </p>
        </motion.div>

        {/* Filter */}
        <TrainerFilter
          selectedStatus={selectedStatus}
          handleStatusFilter={handleStatusFilter}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          statusCount={statusCount}
          debouncedSearch={debouncedSearch}
        />

        {/* Table */}
        <TrainerTable
          trainers={trainers}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          handleView={handleView}
          handleOpenCreate={handleOpenCreate}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        {/* Modal */}
        <TrainerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          mode={mode}
          trainerId={selectedTrainer}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default TrainerSection;
