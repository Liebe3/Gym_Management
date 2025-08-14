const User = require("../models/User");

// Get all members (Admin only)
exports.getMembers = async (req, res) => {
  try {
    // Only admin can access
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const members = await User.find({ role: "member" });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new member (Admin only)
exports.createMember = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { firstName, lastName, email, phone, membershipType } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Required fields missing",
        required: ["firstName", "lastName", "email"],
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newMember = new User({
      firstName,
      lastName,
      email,
      role: "member",
      phone: phone || undefined,
      membershipType: membershipType || undefined,
      joinedDate: membershipType ? new Date() : undefined,
      status: membershipType ? "Active" : "Pending",
      password: "defaultPassword123", // Admin can set default, user can change later
    });

    await newMember.save();
    res.status(201).json({ message: "Member created successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update member (Admin or user updating their own membership)
exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Admin can update any member, normal user can only update their own
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const member = await User.findOneAndUpdate(
      { _id: id, role: "member" },
      updates,
      { new: true }
    );

    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member updated successfully", member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete member (Admin only)
exports.deleteMember = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const member = await User.findOneAndDelete({ _id: req.params.id, role: "member" });

    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single member (Admin or the member themselves)
exports.getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const member = await User.findOne({ _id: id, role: "member" });

    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
