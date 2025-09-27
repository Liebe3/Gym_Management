import Sidebar from "../dashboard/layout/Sidebar";
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar fixed on the left */}
      <Sidebar />
      {/* Main content area */}
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
