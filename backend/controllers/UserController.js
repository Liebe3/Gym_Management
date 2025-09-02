const User = require("../models/User");
const createFilter = require("../utils/filters");

exports.getAllUser = async (req, res) => {
  try {
    const searchableFields = ["firstName", "lastName", "email"];
    const filterableFields = {
      role: "role",
    };

    const filter = createFilter.buildFilter(
      req.query,
      searchableFields,
      filterableFields
    );
    const sort = createFilter.buildSort(req.query, { createdAt: -1 });
    const { page, limit, skip } = createFilter.buildPagination(req.query);

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select("-password");

    const totalFiltered = await User.countDocuments(filter);

    const counts = await createFilter.buildCounts(User, "role");

    res.json(
      createFilter.buildResponse(
        users,
        { page, limit },
        filter,
        counts,
        totalFiltered
      )
    );
  } catch (error) {
    console.error("Error fetching users", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};
