// utils/filters.js (CommonJS)
const createFilter = {
  buildFilter: (query, searchableFields = [], filterableFields = {}) => {
    const filter = {};

    if (query.search && searchableFields.length > 0) {
      filter.$or = searchableFields.map(field => ({
        [field]: { $regex: query.search, $options: "i" }
      }));
    }

    Object.entries(filterableFields).forEach(([queryParam, dbField]) => {
      if (query[queryParam] && query[queryParam] !== "all") {
        filter[dbField] = query[queryParam];
      }
    });

    return filter;
  },

  buildSort: (query, defaultSort = { createdAt: -1 }) => {
    if (query.sortBy) {
      return { [query.sortBy]: query.sortOrder === "desc" ? -1 : 1 };
    }
    return defaultSort;
  },

  buildPagination: (query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
  },

  buildCounts: async (Model, groupByField, totalFilter = {}) => {
    const distribution = await Model.aggregate([
      { $match: totalFilter },
      { $group: { _id: `$${groupByField}`, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const counts = distribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    counts.all = await Model.countDocuments(totalFilter);
    return counts;
  },

  buildResponse: (data, pagination, filter, counts, totalFiltered) => {
    const { page, limit } = pagination;
    const totalPages = Math.ceil(totalFiltered / limit);

    return {
      success: true,
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalFiltered,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit
      },
      filter: {
        applied: filter,
        counts,
        totalFiltered
      }
    };
  }
};

module.exports = createFilter;
