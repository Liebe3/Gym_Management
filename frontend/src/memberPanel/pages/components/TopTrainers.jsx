const TopTrainers = ({ trainers }) => {
  if (!trainers || trainers.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No top trainers available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trainers.map((trainer, idx) => (
        <div
          key={trainer._id}
          className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-br from-gray-50 dark:from-gray-700 to-gray-100 dark:to-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md dark:hover:shadow-lg transition-shadow"
        >
          {/* Rank Badge */}
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                idx === 0
                  ? "bg-yellow-500"
                  : idx === 1
                  ? "bg-gray-400 dark:bg-gray-500"
                  : "bg-orange-600 dark:bg-orange-700"
              }`}
            >
              #{idx + 1}
            </div>
          </div>

          {/* Trainer Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {trainer.firstName} {trainer.lastName}
            </p>
            {trainer.specializations && trainer.specializations.length > 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {trainer.specializations.join(", ")}
              </p>
            )}
            {trainer.experience && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {trainer.experience} yrs experience
              </p>
            )}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {trainer.sessionCount} sessions
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopTrainers;
