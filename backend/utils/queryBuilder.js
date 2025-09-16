// Build search and filter query
const buildQuery = (
  req,
  searchableFields = [],
  filterableFields = {},
  arrayFields = []
) => {
  const filter = {};
  const { search, ...query } = req.query;

  // Searchable fields
  if (search && searchableFields.length > 0) {
    filter.$or = searchableFields.map((field) => {
      if (arrayFields.includes(field)) {
        // Correct way to search inside arrays
        return { [field]: { $elemMatch: { $regex: search, $options: "i" } } };
      }
      return { [field]: { $regex: search, $options: "i" } };
    });
  }

  // Filterable fields
  Object.entries(filterableFields).forEach(([key, dbField]) => {
    if (query[key] && query[key] !== "all") {
      filter[dbField] = query[key];
    }
  });

  return filter;
};

// Sorting
const buildSort = (sortBy, sortOrder, defaultSort = { createdAt: -1 }) => {
  if (sortBy) return { [sortBy]: sortOrder === "desc" ? -1 : 1 };
  return defaultSort;
};

// Pagination
const buildPagination = (page = 1, limit = 10) => {
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const skip = (pageNum - 1) * limitNum;
  return { page: pageNum, limit: limitNum, skip };
};

module.exports = { buildQuery, buildSort, buildPagination };
