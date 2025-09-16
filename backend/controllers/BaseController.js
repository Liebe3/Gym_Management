const {
  buildQuery,
  buildSort,
  buildPagination,
} = require("../utils/queryBuilder");
const { buildCounts, findRelatedIds } = require("../utils/aggregationHelper");
const { buildResponse } = require("../utils/responseBuilder");

const getAll = async (Model, req, res, config = {}) => {
  try {
    const {
      searchableFields = [],
      filterableFields = {},
      arrayFields = [],
      populate = [],
      countableFields = [],
    } = config;

    let filter = buildQuery(
      req,
      searchableFields,
      filterableFields,
      arrayFields
    );

    // Custom user search
    if (config.customSearch && req.query.search) {
      const userIds = await findRelatedIds(
        config.customSearch.model,
        req.query.search,
        config.customSearch.fields
      );
      filter.$or = [
        ...(filter.$or || []),
        {
          [config.customSearch.key]: {
            $in: userIds.length > 0 ? userIds : [null],
          },
        },
      ];
    }

    const sort = buildSort(
      req.query.sortBy,
      req.query.sortOrder,
      config.defaultSort
    );
    const { page, limit, skip } = buildPagination(
      req.query.page,
      req.query.limit
    );

    let queryChain = Model.find(filter);
    populate.forEach(
      (pop) => (queryChain = queryChain.populate(pop.path, pop.select))
    );

    const documents = await queryChain.sort(sort).skip(skip).limit(limit);
    const totalFiltered = await Model.countDocuments(filter);

    const counts = {};
    for (const field of countableFields) {
      counts[field] = await buildCounts(Model, field);
    }

    const response = buildResponse(
      documents,
      { page, limit, skip },
      filter,
      counts,
      totalFiltered
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll };
