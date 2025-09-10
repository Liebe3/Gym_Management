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

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Member Id is required",
      });
    }

    // Validate email format if provided
    //  uncomment if the code is working and not need testing
    // if (email) {
    //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //   if (!emailRegex.test(email)) {
    //     return res.status(400).json({
    //       success: false,
    //       message: "Please provide a valid email address",
    //     });
    //   }
    // }

    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Validate password requirements if provided
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
      }

      // Optional: Add more password complexity requirements
      // uncomment if the code is working and not need testing
      // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      // if (!passwordRegex.test(password)) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      //   });
      // }
    }

    const isFirstNameEmpty = firstName && firstName.trim().length === 0;
    if (isFirstNameEmpty) {
      return res.status(400).json({
        success: false,
        message: "First name cannot be empty",
      });
    }

    const isLastNameEmpty = lastName && lastName.trim().length === 0;
    if (isLastNameEmpty) {
      return res.status(400).json({
        success: false,
        message: "Last name cannot be empty",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields only if they are provided
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: userResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
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
