import { AnimatePresence, motion } from "framer-motion";
import { CgGym } from "react-icons/cg";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiEdit3,
  FiFilter,
  FiMail,
  FiMinusCircle,
  FiPlus,
  FiTrash2,
  FiUser,
  FiXCircle
} from "react-icons/fi";
import CreateMemberButon from "../ui/CreateMemberButon";
const MemberTable = ({
  members = [],
  onEdit,
  onDelete,
  handleOpenCreate,
  hasActiveFilters,
  clearFilters,
  pagination = {},
  currentPage,
  setCurrentPage,
	formatDate
}) => {
  if (members.length === 0) {
    return (
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Clear Filters
            </motion.button>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No members available.
            </p>
            <CreateMemberButon onClick={handleOpenCreate}>
              <div className="flex items-center">
                <FiPlus className="w-4 h-4 mr-2" />
                Create Your First Member
              </div>
            </CreateMemberButon>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <CreateMemberButon onClick={handleOpenCreate}>
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
                  <CgGym className="w-4 h-4 mr-2 text-emerald-600" />
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
                    {member.trainer?.user ? (
                      <span className="inline-flex items-center">
                        {`${member.trainer.user.firstName} ${
                          member.trainer.user.lastName || ""
                        }`}
                      </span>
                    ) : (
                      <span className="text-red-400 dark:text-gray-500">
                        Unassigned
                      </span>
                    )}
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
                        onClick={() => onEdit(member)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                        title="Edit Member"
                      >
                        <FiEdit3 className="w-3 h-3" />
                      </motion.button>

                      <motion.button
                        onClick={() => onDelete(member._id)}
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
  );
};

export default MemberTable;
