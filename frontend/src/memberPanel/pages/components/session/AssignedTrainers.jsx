import { FiAward, FiTrendingUp, FiUser } from "react-icons/fi";

const AssignedTrainers = ({ trainers = [] }) => {
  if (!trainers || trainers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <FiUser className="mx-auto text-4xl text-gray-400 dark:text-gray-600 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            No trainers assigned yet
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Your assigned trainers will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map((trainer) => (
        <div
          key={trainer._id}
          className={`relative rounded-lg shadow-sm p-6 border transition-all duration-200 ${
            trainer.isPrimary
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md"
          }`}
        >
          {/* Primary Badge */}
          {trainer.isPrimary && (
            <div className="absolute top-0 right-0 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg flex items-center gap-1">
              <FiAward className="w-3 h-3" />
              Primary
            </div>
          )}

          {/* Content */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* Trainer Name */}
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {trainer.isPrimary ? "🌟 Primary Trainer" : "Trainer"}
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {trainer.user?.firstName} {trainer.user?.lastName}
              </p>

              {/* Specializations */}
              {trainer.specializations &&
                trainer.specializations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {trainer.specializations.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="inline-block bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {trainer.specializations.length > 2 && (
                      <span className="inline-block text-xs text-gray-600 dark:text-gray-400 px-2.5 py-1">
                        +{trainer.specializations.length - 2} more
                      </span>
                    )}
                  </div>
                )}

              {/* Experience */}
              {trainer.experience && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiTrendingUp className="w-4 h-4" />
                  <span>
                    {trainer.experience} year{trainer.experience > 1 ? "s" : ""}{" "}
                    experience
                  </span>
                </div>
              )}

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    trainer.status === "active"
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {trainer.status === "active" ? "Active" : trainer.status}
                </span>
              </div>
            </div>

            {/* Icon */}
            <div
              className={`flex-shrink-0 ${
                trainer.isPrimary
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <FiUser className="w-10 h-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AssignedTrainers;
