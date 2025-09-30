import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import memberService from "../../../services/memberService";
import MemberModal from "../components/ui/MemberModal";
import MemberFilter from "./members/MemberFilter";
import MemberTable from "./members/MemberTable";

const MemberSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mode, setMode] = useState("create");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch members
  const loadMembers = async () => {
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

      const response = await memberService.getAllMember(filters);

      if (response.success) {
        setMembers(response.data || []);
        setPagination(response.pagination || {});
        // Fixed: Access status counts correctly from the nested structure
        setStatusCount(response.filter?.counts?.status || {});
      } else {
        setError(response.message || "Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members", error);
      setError("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [selectedStatus, debouncedSearch, currentPage]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
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

  const hanldeOpenCreate = () => {
    setMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setMode("update");
    setIsModalOpen(true);
    setSelectedMember(member);
  };

  const handleDelete = async (deleteId) => {
    try {
      const result = await ShowWarning("This action cannot be undone");
      if (result.isConfirmed) {
        await memberService.deleteMember(deleteId);
        showSuccess("Member has been deleted");
        await loadMembers();
      }
    } catch (error) {
      console.error("Error deleting member", error);
      showError("Failed to delete the member");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMode("create");
    setSelectedMember(null); // Fixed: Clear selected member
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    loadMembers();
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString();
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-evenly">
        <p className="text-emerald-600 font-bold text-xl tracking-wide animate-pulse mt-5">
          Fetching members...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Please wait while we load the available members
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
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">Members</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize your members
          </p>
        </motion.div>

        {/* Filter */}
        <MemberFilter
          selectedStatus={selectedStatus}
          handleStatusFilter={handleStatusFilter}
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          clearFilters={clearFilters}
          statusCount={statusCount}
          debouncedSearch={debouncedSearch}
        />

        {/* Table */}
        <MemberTable
          members={members}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          handleOpenCreate={hanldeOpenCreate}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          pagination={pagination}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          formatDate={formatDate}
        />

        <MemberModal
          isModalOpen={isModalOpen}
          mode={mode}
          selectedMember={selectedMember}
          handleCloseModal={handleCloseModal}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default MemberSection;
