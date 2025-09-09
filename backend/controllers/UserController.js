const User = require("../models/User");
const Member = require("../models/Member");
const bcrypt = require("bcryptjs");
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

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
      //delete the user with membership 
    await Member.deleteMany({ user: id });

    res
      .status(200)
      .json({ success: true, message: "User and related memberships deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
