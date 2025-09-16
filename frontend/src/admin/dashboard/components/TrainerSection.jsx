import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiMail,
  FiStar,
  FiTag,
  FiUser,
  FiUsers,
  FiAlertCircle
} from "react-icons/fi";
import trainerService from "../../../services/trainerService";
import TrainerFilter from "./trainer/TrainerFilter";
import TrainerRow from "./trainer/TrainerRow";
import Loading from "../../../components/ui/Loading";

const TrainerSection = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter and search states
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusCount, setStatusCount] = useState({});
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const loadTrainers = async () => {
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

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
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
      console.error("Error fetching trainers", error);
      setError("Failede to fetch trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, [selectedStatus, searchTerm, currentPage]);

  // Filter and search handlers
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
    setCurrentPage(1);
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

  return (
    <div className="w-full">
      <div className="max-w-full">
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

        {/* Filter and Search Section */}
        <div>
          <TrainerFilter
            selectedStatus={selectedStatus}
            handleStatusFilter={handleStatusFilter}
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            clearFilters={clearFilters}
            statusCount={statusCount}
          />
        </div>

        {/* Trainers Table */}
        <div className="overflow-x-auto">
          <div className="max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                      First Name
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-2 text-emerald-600" />
                      Last Name
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
                      <FiTag className="w-4 h-4 mr-2 text-emerald-600" />
                      Specializations
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden lg:table-cell">
                    <div className="flex items-center">
                      <FiStar className="w-4 h-4 mr-2 text-emerald-600" />
                      Rating
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden lg:table-cell">
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-2 text-emerald-600" />
                      Clients
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm hidden xl:table-cell">
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2 text-emerald-600" />
                      Schedule
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-900 dark:text-white text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {trainers.map((trainer, index) => (
                    <TrainerRow
                      key={trainer._id}
                      trainer={trainer}
                      index={index}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSection;
