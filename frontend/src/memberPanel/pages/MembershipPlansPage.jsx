import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { getMembershipPlans } from "../../services/memberPanel/memberMemberShipPlanService";
import CurrentPlanBanner from "./components/membership/CurrentPlanBanner";
import HelpSection from "./components/membership/HelpSection";
import PlansSection from "./components/membership/PlanSection";

import Loading from "../../components/ui/Loading";

const MembershipPlansPage = () => {
  const [allPlans, setAllPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembershipData();
  }, []);

  const fetchMembershipData = async () => {
    try {
      setLoading(true);
      const response = await getMembershipPlans();

      if (response.success) {
        setAllPlans(response.data.allPlans || []);
        setCurrentPlan(response.data.currentMembershipPlan);
      } else {
        setError(response.message || "Failed to fetch membership data");
      }
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching membership data"
      );
      console.error("Error fetching membership:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 flex items-start gap-4">
            <FiAlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5 text-xl" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-300">
                Error
              </h3>
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            Membership Plans
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Choose the perfect plan for your fitness journey
          </p>
        </div>

        {/* Current Plan Banner */}
        {currentPlan && <CurrentPlanBanner currentPlan={currentPlan} />}

        {/* Plans Section */}
        <PlansSection allPlans={allPlans} currentPlan={currentPlan} />

        {/* Help Section */}
        <HelpSection />
      </div>
    </div>
  );
};

export default MembershipPlansPage;
