const Member = require("../models/Member");
const User = require("../models/User");
const MembershipPlan = require("../models/MemberShipPlan");
const Payment = require("../models/Payment");
const createFilter = require("../utils/filters");

exports.getAllMember = async (req, res) => {
  try {
    // Base filter from query (status, membershipPlan)
    const filterableFields = {
      status: "status",
      membershipPlan: "membershipPlan",
    };

    // Leave searchableFields empty (we handle user manually)
    const searchableFields = [];

    let filter = createFilter.buildFilter(
      req.query,
      searchableFields,
      filterableFields
    );

    // 🔍 Handle search against User collection
    if (req.query.search) {
      const users = await User.find({
        $or: [
          { firstName: { $regex: req.query.search, $options: "i" } },
          { lastName: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map((user) => user._id);

      //  Always set filter.user (if no match, force it to an impossible condition)
      filter.user = { $in: userIds.length > 0 ? userIds : [null] };
    }

    // Sorting + pagination from utils
    const sort = createFilter.buildSort(req.query, { createdAt: -1 });
    const { page, limit, skip } = createFilter.buildPagination(req.query);

    // Query members
    const members = await Member.find(filter)
      .populate("user", "firstName lastName email phone")
      .populate("membershipPlan", "name price duration durationType")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count filtered
    const totalFiltered = await Member.countDocuments(filter);

    // Counts for filters (ignores applied filters)
    const statusCounts = await createFilter.buildCounts(Member, "status");
    const membershipPlanCounts = await createFilter.buildCounts(
      Member,
      "membershipPlan"
    );

    // Build response
    const response = createFilter.buildResponse(
      members,
      { page, limit },
      filter,
      {
        status: statusCounts,
        membershipPlan: membershipPlanCounts,
      },
      totalFiltered
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createMember = async (req, res) => {
  try {
    const {
      userId,
      membershipPlanId,
      startDate,
      endDate,
      status,
      autoRenew,
      paymentDetails,
    } = req.body;

    //validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //validate plan
    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Check if plan is active
    if (plan.status !== "active") {
      return res.status(400).json({
        message: "Cannot assign inactive membership plan",
      });
    }

    if (!startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // ignore time

    const start = startDate ? new Date(startDate) : today;
    let calculatedEndDate;

    if (endDate) {
      calculatedEndDate = new Date(endDate);

      // stricter check: end must be AFTER start
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
      // auto-calculate endDate based on plan duration
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

    // UPDATED: Check for ANY existing membership for this user
    const existingMember = await Member.findOne({
      user: userId,
    });

    if (existingMember) {
      return res.status(400).json({
        message: "User already has an active membership",
      });
    }

    const newMember = new Member({
      user: userId,
      membershipPlan: membershipPlanId,
      startDate: startDate || new Date(),
      endDate: calculatedEndDate,
      status: status || "pending", // Changed from "none" to "pending"
      autoRenew: autoRenew || false,
    });
    await newMember.save();

    let payment = null;
    if (paymentDetails) {
      payment = new Payment({
        member: newMember._id,
        membershipPlan: membershipPlanId,
        amount: paymentDetails.amount || plan.price,
        paymentMethod: paymentDetails.paymentMethod,
        status: paymentDetails.status || "completed",
        paymentDate: paymentDetails.paymentDate || new Date(),
        transactionId: paymentDetails.transactionId,
        description: paymentDetails.description,
        receiptNumber: paymentDetails.receiptNumber,
      });
      await payment.save();

      // Update member status based on payment
      if (payment.status === "completed") {
        newMember.status = "active";
        await newMember.save();

        user.role = "member";
        await user.save();
      }
    } else {
      if (newMember.status === "active") {
        user.role = "member";
        await user.save();
      }
    }

    // Get the populated member data
    const populatedMember = await Member.findById(newMember._id)
      .populate("user", "firstName lastName email phone role")
      .populate("membershipPlan", "name price duration durationType");

    console.log("Created member:", populatedMember.toJSON());

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: {
        member: populatedMember,
        payment: payment,
      },
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
    const { status, startDate, endDate } = req.body;

    // Validate member ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    // Find the existing member
    const existingMember = await Member.findById(id)
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType");

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Prepare update object with only allowed fields
    const updateData = {};

    // Validate and add status if provided
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

    // Validate and add dates if provided
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

      // Allow past start dates for existing members (they might need to correct historical data)
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

      // Validate end date against start date
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

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "No valid fields provided for update. You can only update: status, startDate, endDate",
      });
    }

    // Update the member
    const updatedMember = await Member.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validators
    })
      .populate("user", "firstName lastName email phone role")
      .populate("membershipPlan", "name price duration durationType");

    // Handle user role update based on status change
    if (status !== undefined && existingMember.user) {
      const user = await User.findById(existingMember.user._id);
      if (user) {
        if (status === "active" || status === "pending") {
          // Set user role to member when membership becomes active
          if (user.role !== "member") {
            user.role = "member";
            await user.save();
          }
        } else if (status === "expired" || status === "none") {
          // Check if user has other active memberships before changing role
          const otherActiveMemberships = await Member.findOne({
            user: user._id,
            _id: { $ne: id }, // Exclude current membership
            status: "active",
            endDate: { $gte: new Date() },
          });

          // If no other active memberships, revert to user role
          if (!otherActiveMemberships && user.role === "member") {
            user.role = "user";
            await user.save();
          }
        }
      }
    }

    console.log("Updated member:", updatedMember.toJSON());

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
      updatedFields: Object.keys(updateData),
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

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID format",
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

    res
      .status(200)
      .json({ success: true, message: "Member deleted successfully" });
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

    // Check for ANY existing membership (any status)
    const existingMembership = await Member.findOne({
      user: userId,
    })
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType");

    res.status(200).json({
      success: true,
      existingMembership: existingMembership,
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
