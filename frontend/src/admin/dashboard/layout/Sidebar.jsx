import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ThemeContext from "../../../pages/context/ThemeContext";
import AuthContext from "../../../pages/context/AuthContext";
import Loading from "../../../components/ui/Loading";
import { useNavigate } from "react-router-dom";

import {
  MdDashboard,
  MdPeople,
  MdCardMembership,
  MdList,
  MdFitnessCenter,
  MdPerson,
  MdCalendarToday,
  MdPayment,
  MdAnalytics,
  MdSettings,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
  MdGroups,
  MdLightMode,
  MdDarkMode,
} from "react-icons/md";

const iconMap = {
  dashboard: MdDashboard,
  people: MdPeople,
  groups: MdGroups,
  card_membership: MdCardMembership,
  list_alt: MdList,
  fitness_center: MdFitnessCenter,
  person: MdPerson,
  calendar_today: MdCalendarToday,
  payment: MdPayment,
  analytics: MdAnalytics,
  settings: MdSettings,
  theme: MdLightMode, // default, will swap dynamically
};

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: "dashboard" },
  { name: "Member", href: "/admin/member", icon: "groups" },
  { name: "User", href: "/admin/user", icon: "people" },
  { name: "Trainers", href: "/admin/trainers", icon: "fitness_center" },
  { name: "Memberships", href: "/admin/memberships", icon: "card_membership" },
  {
    name: "Membership Plans",
    href: "/admin/membership-plans",
    icon: "list_alt",
  },
  { name: "Settings", href: "/admin/settings", icon: "settings" },
  { name: "Theme", href: "#", icon: "theme" },
];

const Sidebar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout, user, loading } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };
  const textVariants = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -10 },
  };

  if (!user) return null;

  if (loading) {
    return <Loading />;
  }
  return (
    <motion.div
      className={`min-h-screen flex flex-col shadow-xl relative border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700`}
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapse Button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-full p-1.5 shadow-lg hover:shadow-xl z-10 cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {isCollapsed ? (
          <MdChevronRight size={16} />
        ) : (
          <MdChevronLeft size={16} />
        )}
      </motion.button>

      {/* Header */}
      <motion.div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-header"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-emerald-600">
                Gym Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Admin Dashboard
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-header"
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MdFitnessCenter size={20} className="text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sidebarLinks.map((link, index) => {
            const IconComponent =
              link.icon === "theme"
                ? theme === "dark"
                  ? MdDarkMode
                  : MdLightMode
                : iconMap[link.icon];

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <NavLink
                  to={link.href}
                  onClick={link.icon === "theme" ? toggleTheme : undefined}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? "bg-emerald-600 shadow-lg text-white"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-emerald-600"
                          layoutId="activeBackground"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <motion.div className="relative z-10 flex items-center w-full">
                        <IconComponent
                          size={20}
                          className={`${
                            isCollapsed ? "mx-auto" : "mr-3"
                          } transition-colors duration-200`}
                        />
                        {!isCollapsed && (
                          <motion.span
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={`transition-colors duration-200`}
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </motion.div>
                    </>
                  )}
                </NavLink>
              </motion.li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <motion.div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="expanded-footer"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-3 text-gray-500 dark:text-gray-300">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MdPerson size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {`Admin ${user.firstName}`}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-sm flex items-center justify-center p-2 rounded-lg  hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-600 hover:text-emerald-600  dark:hover:text-emerald-400 transition-all duration-200 cursor-pointer"
              >
                <MdLogout size={16} className="mr-2" /> Logout
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed-footer"
              className="flex flex-col items-center space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <MdPerson size={20} className="text-white" />
              </div>
              <button
                onClick={handleLogout}
                className=" hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-300 text-gray-600 hover:text-emerald-600  dark:hover:text-emerald-400 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <MdLogout size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
