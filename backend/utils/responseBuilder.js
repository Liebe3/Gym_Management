const buildResponse = (data, pagination, filter, counts, totalFiltered) => {
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
      limit,
    },
    filter: {
      applied: filter,
      counts,
      totalFiltered,
    },
  };
};

module.exports = { buildResponse };
