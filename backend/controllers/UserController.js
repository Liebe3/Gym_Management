const User = require("../models/User");

exports.getAllUser = async (req, res) => {
  try {
    //get query params
    const { role, search, sortBy, sortOrder, page, limit } = req.query;

    const filter = {};

    if (role && role !== "all") {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .select("-password");

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limitNum);

    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const roleCounts = roleDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    roleCounts.all = await User.countDocuments({});

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalUsers,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
      filter: {
        applied: filter,
        roleCounts,
        totalFiltered: totalUsers,
      },
    });
  } catch (error) {
    console.error("Erro fetching users", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
