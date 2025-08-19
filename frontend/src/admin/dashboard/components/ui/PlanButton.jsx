const PlanButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-emerald-600 text-white rounded cursor-pointer"
    >
      {children}
    </button>
  );
};

export default PlanButton;
