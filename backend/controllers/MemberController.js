const Member = require("../models/Member");
const User = require("../models/User");
const MembershipPlan = require("../models/MemberShipPlan");
const Trainer = require("../models/Trainer");
const { getAll } = require("./BaseController");

exports.getAllMember = async (req, res) => {
  return getAll(Member, req, res, {
    filterableFields: { status: "status", membershipPlan: "membershipPlan" },
    populate: [
      { path: "user", select: "firstName lastName email" },
      { path: "membershipPlan", select: "name price duration durationType" },
      {
        path: "trainers",
        match: { status: "active", isAvailableForNewClients: true },
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      },
      {
        path: "primaryTrainer",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      },
    ],
    countableFields: ["status", "membershipPlan"],
    customSearch: {
      model: User,
      fields: ["firstName", "lastName", "email"],
      key: "user",
    },
    defaultSort: { createdAt: -1 },
  });
};

exports.createMember = async (req, res) => {
  try {
    const {
      userId,
      membershipPlanId,
      trainerIds = [],
      primaryTrainerId,
      startDate,
      endDate,
      status,
    } = req.body;

    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate plan
    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Validate plan is active
    if (plan.status !== "active") {
      return res.status(400).json({
        message: "Cannot assign inactive membership plan",
      });
    }

    // Validate trainers if provided
    let validatedTrainerIds = [];
    if (trainerIds && trainerIds.length > 0) {
      const trainers = await Trainer.find({
        _id: { $in: trainerIds },
        status: "active",
      });

      if (trainers.length !== trainerIds.length) {
        return res.status(404).json({
          message: "One or more trainers not found or not active",
        });
      }
      validatedTrainerIds = trainerIds;
    }

    // Validate primary trainer
    let validatedPrimaryTrainerId = null;
    if (primaryTrainerId) {
      const primaryTrainer = await Trainer.findById(primaryTrainerId);
      if (!primaryTrainer) {
        return res.status(404).json({
          message: "Primary trainer not found",
        });
      }
      // Ensure primary trainer is in trainers list
      if (!validatedTrainerIds.includes(primaryTrainerId)) {
        validatedTrainerIds.push(primaryTrainerId);
      }
      validatedPrimaryTrainerId = primaryTrainerId;
    }

    if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    let calculatedEndDate;

    if (endDate) {
      calculatedEndDate = new Date(endDate);
      if (calculatedEndDate <= start) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }
      if (calculatedEndDate < today) {
        return res
          .status(400)
          .json({ message: "End date cannot be in the past" });
      }
    } else {
      calculatedEndDate = new Date(start);
      switch (plan.durationType) {
        case "days":
          calculatedEndDate.setDate(
            calculatedEndDate.getDate() + plan.duration
          );
          break;
        case "weeks":
          calculatedEndDate.setDate(
            calculatedEndDate.getDate() + plan.duration * 7
          );
          break;
        case "months":
          calculatedEndDate.setMonth(
            calculatedEndDate.getMonth() + plan.duration
          );
          break;
        case "years":
          calculatedEndDate.setFullYear(
            calculatedEndDate.getFullYear() + plan.duration
          );
          break;
      }
    }

    // Check for existing active membership
    const existingMember = await Member.findOne({
      user: userId,
      status: "active",
      endDate: { $gte: today },
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User already has an active membership",
      });
    }

    const newMember = new Member({
      user: userId,
      membershipPlan: membershipPlanId,
      trainers: validatedTrainerIds,
      primaryTrainer: validatedPrimaryTrainerId,
      startDate: start,
      endDate: calculatedEndDate,
      status: status || "pending",
    });

    await newMember.save();

    // Update user role to member
    if (user.role !== "member") {
      user.role = "member";
      await user.save();
    }

    // Populate and return
    const populatedMember = await Member.findById(newMember._id)
      .populate("user", "firstName lastName email role")
      .populate("membershipPlan", "name price duration durationType")
      .populate({
        path: "trainers",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "primaryTrainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: populatedMember,
    });
  } catch (error) {
    console.error("Error creating member:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      startDate,
      endDate,
      membershipPlanId,
      trainerIds,
      primaryTrainerId,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    const existingMember = await Member.findById(id)
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType");

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const updateData = {};

    // Handle trainers update
    if (trainerIds !== undefined) {
      if (trainerIds && trainerIds.length > 0) {
        const trainers = await Trainer.find({
          _id: { $in: trainerIds },
        });

        if (trainers.length !== trainerIds.length) {
          return res.status(404).json({
            success: false,
            message: "One or more trainers not found",
          });
        }
        updateData.trainers = trainerIds;
      } else {
        updateData.trainers = [];
      }
    }

    // Validate and update primary trainer
    if (primaryTrainerId !== undefined) {
      if (primaryTrainerId) {
        const trainer = await Trainer.findById(primaryTrainerId);
        if (!trainer) {
          return res.status(404).json({
            success: false,
            message: "Primary trainer not found",
          });
        }
        updateData.primaryTrainer = primaryTrainerId;
      } else {
        updateData.primaryTrainer = null;
      }
    }

    // Handle membership plan update
    if (membershipPlanId !== undefined) {
      const plan = await MembershipPlan.findById(membershipPlanId);
      if (!plan) {
        return res.status(404).json({
          success: false,
          message: "Membership plan not found",
        });
      }

      if (plan.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Cannot assign inactive membership plan",
        });
      }

      updateData.membershipPlan = membershipPlanId;
    }

    // Handle status update
    if (status !== undefined) {
      const validStatuses = ["active", "expired", "none", "pending"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      updateData.status = status;
    }

    // Handle dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate !== undefined) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid start date format",
        });
      }
      updateData.startDate = start;
    }

    if (endDate !== undefined) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid end date format",
        });
      }

      const finalStartDate = startDate
        ? new Date(startDate)
        : existingMember.startDate;
      if (end <= finalStartDate) {
        return res.status(400).json({
          success: false,
          message: "End date must be after start date",
        });
      }

      updateData.endDate = end;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedMember = await Member.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("user", "firstName lastName email role")
      .populate("membershipPlan", "name price duration durationType")
      .populate({
        path: "trainers",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .populate({
        path: "primaryTrainer",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      });

    // Update user role based on status
    if (status !== undefined && existingMember.user) {
      const user = await User.findById(existingMember.user._id);
      if (user) {
        if (status === "active") {
          if (user.role !== "member") {
            user.role = "member";
            await user.save();
          }
        } else if (status === "expired" || status === "none") {
          const otherActiveMemberships = await Member.findOne({
            user: user._id,
            _id: { $ne: id },
            status: "active",
            endDate: { $gte: new Date() },
          });

          if (!otherActiveMemberships && user.role === "member") {
            user.role = "user";
            await user.save();
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    console.error("Error updating member:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    const activeMembership = await Member.findOne({
      user: deletedMember.user,
      status: "active",
      endDate: { $gte: new Date() },
    });

    if (!activeMembership) {
      await User.findByIdAndUpdate(deletedMember.user, { role: "user" });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkUserActiveMemberShip = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const existingMembership = await Member.findOne({
      user: userId,
    })
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType")
      .populate({
        path: "trainers",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      });

    res.status(200).json({
      success: true,
      existingMembership,
      hasExistingMembership: !!existingMembership,
    });
  } catch (error) {
    console.error("Error checking user existing membership:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};