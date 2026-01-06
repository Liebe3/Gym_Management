const Member = require("../../models/Member");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

exports.getMemberProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const member = await Member.findOne({ user: userId }).populate({
      path: "user",
      select: "firstName lastName email phone",
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }
    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.error("Get member profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateMemberProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName } = req.body;

    // Find the member
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    // Update User model fields
    const updateUserData = {};
    if (firstName) updateUserData.firstName = firstName.trim();
    if (lastName) updateUserData.lastName = lastName.trim();

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(userId, updateUserData, {
      new: true,
      runValidators: true,
    }).select("firstName lastName email");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
        member: {
          membershipPlan: member.membershipPlan,
          status: member.status,
          startDate: member.startDate,
          endDate: member.endDate,
        },
      },
    });
  } catch (error) {
    console.error("Update member profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateMemberPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    // Find user with password field
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password (assuming you're using bcrypt)
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
