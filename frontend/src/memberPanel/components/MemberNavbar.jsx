import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import {
  MdCardMembership,
  MdClose,
  MdDarkMode,
  MdDashboard,
  MdFitnessCenter,
  MdLightMode,
  MdLogout,
  MdMenu,
  MdPerson,
} from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../pages/context/AuthContext";
import ThemeContext from "../../pages/context/ThemeContext";

const MemberNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/member/home", icon: MdDashboard },
    { name: "Membership", href: "/member/membership", icon: MdCardMembership },
    { name: "Trainers", href: "/member/trainer", icon: MdFitnessCenter },
    { name: "Profile", href: "/member/profile", icon: MdPerson },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <MdFitnessCenter size={24} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-emerald-600">FitHub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Member</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              const active = isActive(link.href);

              return (
                <motion.button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-2 ${
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent size={18} />
                  <span>{link.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === "dark" ? (
                <MdLightMode size={22} />
              ) : (
                <MdDarkMode size={22} />
              )}
            </motion.button>

            {/* User Profile (Desktop) */}
            {/* <motion.div
              className="hidden sm:flex items-center space-x-3 pl-5 border-l border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                <MdPerson size={18} className="text-white" />
              </div>
              <div className="hidden lg:block">
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {user?.firstName || "Member"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </motion.div> */}

            {/* Logout Button (Desktop) */}
            <motion.button
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdLogout size={20} />
              <span className="text-base">Logout</span>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <div className="px-6 py-6 space-y-3">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                const active = isActive(link.href);

                return (
                  <motion.button
                    key={link.href}
                    onClick={() => {
                      navigate(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                      active
                        ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <IconComponent size={20} />
                    <span>{link.name}</span>
                  </motion.button>
                );
              })}

              {/* Mobile User Info */}
              <div className="px-4 py-4 my-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MdPerson size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                    {user?.firstName || "Member"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Mobile Logout */}
              <motion.button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-4 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-3 transition-all duration-200"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <MdLogout size={22} />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default MemberNavbar;
