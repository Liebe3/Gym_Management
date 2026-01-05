import EmptyPlans from "./EmptyPlans";
import PlanCard from "./PlanCard";

const PlansSection = ({ allPlans, currentPlan }) => {
  const isCurrentPlan = (planId) => {
    return currentPlan?._id === planId;
  };

  return (
    <div>
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {currentPlan ? "Upgrade or Change Plan" : "Available Plans"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          {currentPlan
            ? "Compare and switch to a different plan that fits your needs"
            : "Get started with one of our flexible membership options"}
        </p>
      </div>

      {/* Plans Grid or Empty State */}
      {allPlans.length === 0 ? (
        <EmptyPlans />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPlans.map((plan, index) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              isCurrent={isCurrentPlan(plan._id)}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlansSection;
