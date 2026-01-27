const buildCounts = async (Model, groupByField, baseFilter = {}) => {
  const distribution = await Model.aggregate([
    { $match: baseFilter },
    { $group: { _id: `$${groupByField}`, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const counts = distribution.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  // Special handling for status field - combine all cancelled statuses
  if (groupByField === 'status') {
    const cancelledCount = 
      (counts.cancelled || 0) + 
      (counts.cancelled_by_member || 0) + 
      (counts.cancelled_by_trainer || 0) + 
      (counts.cancelled_by_admin || 0);
    
    counts.cancelled = cancelledCount;
    
    // Optionally remove individual cancelled status counts if you don't need them
    delete counts.cancelled_by_member;
    delete counts.cancelled_by_trainer;
    delete counts.cancelled_by_admin;
  }

  counts.all = await Model.countDocuments(baseFilter);
  return counts;
};

// Find related IDs (e.g., Users)
const findRelatedIds = async (Model, searchTerm, searchFields) => {
  if (!searchTerm) return [];

  const docs = await Model.find({
    $or: searchFields.map((f) => ({
      [f]: { $regex: searchTerm, $options: "i" },
    })),
  }).select("_id");

  return docs.map((d) => d._id);
};

module.exports = { buildCounts, findRelatedIds };