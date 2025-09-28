import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import membershipPlanService from "../../../services/membershipPlansService";
import MemberShipPlanFilter from "./memberhipPlans/MemberShipPlanFilter";
import MemberShipPlanTable from "./memberhipPlans/MemberShipPlanTable";
import MemberShipPlanModal from "./ui/MemberShipPlanModal";

const MembershipPlansSection = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal state
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create");

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  // Fetch membership plans
  const loadMembershipPlans = async () => {
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

      if (debouncedSearch.trim()) {
        filters.search = debouncedSearch.trim();
      }

      const response = await membershipPlanService.getAllPlans(filters);
      if (response.success) {
        setPlans(response.data || []);
        setPagination(response.pagination || {});
        setStatusCount(response.filter?.counts.status || {});
      } else {
        setError(response.message || "Failed to fetch membership plans.");
      }
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      setError("Failed to fetch membership plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembershipPlans();
  }, [selectedStatus, debouncedSearch, currentPage]);

  // Display features
  const displayFeatures = (features) => {
    if (!features || features.length === 0) return "No features listed";
    return Array.isArray(features) ? features.join(", ") : features;
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page on search change
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Open modal for creating plan
  const handleOpenCreate = () => {
    setSelectedPlan(null);
    setMode("create");
    setIsModalOpen(true);
  };

  // Open modal for editing plan
  const handleEditPlan = (plan) => {
    console.log("editin plan", plan)
    setSelectedPlan(plan);
    setMode("update");
    setIsModalOpen(true);
  };

  //delete plan
  const handleDelete = async (deleteId) => {
    try {
      const result = await ShowWarning("This action cannot be undone.");

      if (result.isConfirmed) {
        await membershipPlanService.deletePlan(deleteId);
        showSuccess("Plan has been deleted");
        await loadMembershipPlans(); // load the plan
      }
    } catch (error) {
      console.error("Error deleting plan", error);
      showError("Failed to delete the plan.");
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setMode("create");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-evenly">
        <p className="text-emerald-600 font-bold text-xl tracking-wide animate-pulse mt-5">
          Fetching membership plan...
        </p>

        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we load the available plans
        </p>

        <div className="mt-[-100px]">
          <Loading />
        </div>
      </div>
    );

  if (error)
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
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">
            Membership Plans
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize your subscription plans
          </p>
        </motion.div>

        {/* Filter */}
        <MemberShipPlanFilter
          selectedStatus={selectedStatus}
          handleStatusFilter={handleStatusFilter}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          statusCount={statusCount}
          debouncedSearch={debouncedSearch}
        />

        <MemberShipPlanTable
          plans={plans}
          onEdit={handleEditPlan}
          onDelete={handleDelete}
          handleOpenCreate={handleOpenCreate}
          displayFeatures={displayFeatures}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
        
        {/* Modal */}
        <MemberShipPlanModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          mode={mode}
          selectedPlan={selectedPlan}
          onSuccess={() => {
            setIsModalOpen(false);
            loadMembershipPlans();
          }}
        />
      </div>
    </div>
  );
};

export default MembershipPlansSection;
