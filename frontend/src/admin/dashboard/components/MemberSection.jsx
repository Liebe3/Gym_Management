import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiFilter,
  FiMail,
  FiMinusCircle,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import Loading from "../../../components/ui/Loading";
import {
  showError,
  showSuccess,
  ShowWarning,
} from "../../../pages/utils/Alert";
import memberService from "../../../services/memberService";
import MemberModal from "../components/ui/MemberModal";
import CreateMemberButon from "./ui/CreateMemberButon";

// Fixed: Updated availableStatus to match your backend status values
const availableStatus = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" }, // Changed from "inactive" to "expired"
  { value: "none", label: "None" },
];

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

        {/* Filter and Search Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
        >
          {/* Search Bar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Members
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white transition-colors duration-200 outline-emerald-500"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <FiX className="w-5 h-5 cursor-pointer" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter  */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FiFilter className="w-5 h-5 text-emerald-600 mr-2" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Status
                </label>
              </div>

              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 text-sm cursor-pointer"
                >
                  <FiX className="w-4 h-4 mr-1 cursor-pointer" />
                  Clear All
                </motion.button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {availableStatus.map((status) => {
                // Fixed: Changed 'role' to 'status'
                const count = statusCount[status.value] || 0;
                const isSelected = selectedStatus === status.value;

                return (
                  <motion.button
                    key={status.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusFilter(status.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span>{status.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* No Members */}
        {members.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              {hasActiveFilters ? (
                <FiFilter className="w-8 h-8 text-gray-400" />
              ) : (
                <FiUser className="w-8 h-8 text-gray-400" />
              )}
            </div>

            {hasActiveFilters ? (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                  No members match your filters
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                  Try adjusting your search or status filter
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200"
                >
                  Clear Filters
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
                  No members available.
                </p>
                <CreateMemberButon onClick={hanldeOpenCreate}>
                  <div className="flex items-center">
                    <FiPlus className="w-4 h-4 mr-2" />
                    Create Your First Member
                  </div>
                </CreateMemberButon>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <CreateMemberButon onClick={hanldeOpenCreate}>
                <div className="flex items-center">
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create New Member
                </div>
              </CreateMemberButon>
            </div>

            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                        First name
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                        Last name
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      <div className="flex items-center">
                        <FiMail className="w-4 h-4 mr-2 text-emerald-600" />
                        Email
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden md:table-cell">
                      <div className="flex items-center">
                        <FiCreditCard className="w-4 h-4 mr-2 text-emerald-600" />
                        Membership Plan
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden md:table-cell">
                      <div className="flex items-center">
                        <FiCreditCard className="w-4 h-4 mr-2 text-emerald-600" />
                        Trainer
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden lg:table-cell">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-2 text-emerald-600" />
                        Start Date
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden lg:table-cell">
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-2 text-emerald-600" />
                        End Date
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {members.map((member, index) => (
                      <motion.tr
                        key={member._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {member.user?.firstName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {member.user?.lastName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {member.user?.email}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                          {member.membershipPlan?.name}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                          {member.trainer?.user
                            ? `${member.trainer.user.firstName} ${
                                member.trainer.user.lastName || ""
                              }`.trim()
                            : "Unassigned"}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                          {formatDate(member.startDate)}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                          {formatDate(member.endDate)}
                        </td>
                        <td className="py-3 px-4">
                          {member.status === "active" ? (
                            <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Active</span>
                            </div>
                          ) : member.status === "pending" ? (
                            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiClock className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Pending</span>
                            </div>
                          ) : member.status === "none" ? (
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiMinusCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">None</span>
                            </div>
                          ) : member.status === "expired" ? (
                            <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiXCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Expired</span>
                            </div>
                          ) : (
                            <div className="flex items-center bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiXCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Inactive</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1">
                            <motion.button
                              onClick={() => handleOpenEdit(member)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Edit Member"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </motion.button>

                            <motion.button
                              onClick={() => handleDelete(member._id)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Delete Member"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages} —{" "}
                  {pagination.totalRecords} total members
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={!pagination.hasPrevPage}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pagination.hasPrevPage
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Prev
                  </button>

                  {/* Numbered pages */}
                  {Array.from(
                    { length: Math.min(pagination.totalPages, 5) },
                    (_, i) => {
                      const startPage = Math.max(1, currentPage - 2);
                      return startPage + i;
                    }
                  )
                    .filter((page) => page <= pagination.totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                          currentPage === page
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    disabled={!pagination.hasNextPage}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      pagination.hasNextPage
                        ? "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                        : "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

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
