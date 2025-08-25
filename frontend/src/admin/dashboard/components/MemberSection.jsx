import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCreditCard,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import memberService from "../../../services/memberService";
import Loading from "../../../components/ui/Loading";
import CreateMemberButon from "./ui/CreateMemberButon";


const MemberSection = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch members
  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.getAllMember(); // singular fn but hits /members
      console.log("Full response:", response); // Add this
      console.log("Response data:", response.data); // Add this
      setMembers(response.data || []);
    } catch (error) {
      console.error("Error fetching members", error);
      setError("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

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

        {/* No Members */}
        {members.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FiUser className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No members available.
            </p>

            {/* create member button */}
            <button>
              <div className="flex items-center">
                <FiPlus className="w-4 h-4 mr-2" />
                Create Your First Member
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >

            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <CreateMemberButon>
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
                        Name
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
                            {member.user?.firstName} {member.user?.lastName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {member.user?.email}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-gray-600 dark:text-gray-400">
                          {member.membershipPlan?.name}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                          {member.startDate}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell text-gray-600 dark:text-gray-400">
                          {member.endDate}
                        </td>
                        <td className="py-3 px-4">
                          {member.status === "active" ? (
                            <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Active</span>
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
                            {/* edit plan action */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Edit Plan"
                            >
                              <FiEdit3 className="w-3 h-3" />
                            </motion.button>

                            {/* delete plan action */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                              title="Delete Plan"
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemberSection;
