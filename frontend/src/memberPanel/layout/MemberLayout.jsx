import { motion } from "framer-motion";
import MemberNavbar from "../components/MemberNavbar";

const MemberLayout = ({ children, title, breadcrumbs }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Navbar */}
      <MemberNavbar />

      {/* Main Content */}
      <motion.main
        className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {/* Footer (Optional) */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8 text-center text-base text-gray-500 dark:text-gray-400">
          <p>© 2025 FitHub Gym Management. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MemberLayout;
