import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaClock, FaUserCheck, FaUsers, FaUserTimes } from "react-icons/fa";
import { FiFilter, FiUser } from "react-icons/fi";
import trainerService from "../../services/trainerService";

import ClientFilter from "./ClientsFilter";
// import ClientsTable from "./ClientsTable";
import Loading from "../../components/ui/Loading";
import ClientsCard from "./ClientsCard";
import Pagination from "./ClientsPagination";

const MyClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingClients: 0,
    expiredClients: 0,
  });
  const [statusCounts, setStatusCounts] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 9,
  });

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch clients
  useEffect(() => {
    fetchClients();
  }, [selectedStatus, debouncedSearch, pagination.currentPage]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = {
        status: selectedStatus,
        search: debouncedSearch,
        page: pagination.currentPage,
        limit: pagination.limit,
      };

      const response = await trainerService.getMyClients(params);

      if (response.success) {
        setClients(response.data);
        setStats(response.stats);
        setStatusCounts(response.counts || response.filter?.counts);
        setPagination({
          currentPage: response.pagination.currentPage,
          totalPages: response.pagination.totalPages,
          totalRecords: response.pagination.totalRecords,
          hasNextPage: response.pagination.hasNextPage,
          hasPrevPage: response.pagination.hasPrevPage,
          limit: response.pagination.limit,
        });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on filter change
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1 on search
  };

  const clearFilters = () => {
    setSelectedStatus("all");
    setSearchTerm("");
    setDebouncedSearch("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusBadge = (status) => {
    const styles = {
      active:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      expired: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
      pending:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400",
      none: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400",
    };
    return styles[status] || styles.none;
  };

  if (loading) {
    return <Loading />;
  }

  const hasActiveFilters = selectedStatus !== "all" || debouncedSearch !== "";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h2 className="text-3xl font-bold text-emerald-600 mb-2">My Clients</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and track your assigned clients
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Clients
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalClients}
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
                Active Members
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.activeClients}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FaUserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pendingClients}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <FaClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
                Expired
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.expiredClients}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <FaUserTimes className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Component */}
      <ClientFilter
        selectedStatus={selectedStatus}
        handleStatusFilter={handleStatusFilter}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        clearFilters={clearFilters}
        statusCount={statusCounts}
        debouncedSearch={debouncedSearch}
      />

      {/* Clients Grid */}
      {clients.length === 0 ? (
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
                No clients match your filters
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                Try adjusting your search or status filter
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
              >
                Clear Filters
              </motion.button>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              You currently have no clients assigned.
            </p>
          )}
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ClientsCard client={client} getStatusBadge={getStatusBadge} />
              </motion.div>
            ))}
          </div>

          {/* Pagination Component */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalRecords={pagination.totalRecords}
              limit={pagination.limit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyClients;
