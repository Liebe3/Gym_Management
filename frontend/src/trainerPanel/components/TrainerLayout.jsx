import TrainerSidebar from "./TrainerSidebar";

const TrainerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <TrainerSidebar />
      <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default TrainerLayout;