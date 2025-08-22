const Member = require("../models/Member");
const User = require("../models/User");
const MembershipPlan = require("../models/MemberShipPlan");
const Payment = require("../models/Payment");

exports.getAllMember = async (req, res) => {
  try {
    // Fixed: Added population and changed response structure
    const members = await Member.find()
      .populate("user", "firstName lastName email phone")
      .populate("membershipPlan", "name price duration durationType")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ 
      success: true,
      data: members,
      count: members.length 
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const plan = await MembershipPlan.findById(membershipPlanId);
    if (!plan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    // Calculate endDate if not provided
    let calculatedEndDate = endDate;
    if (!endDate && startDate) {
      const start = new Date(startDate);
      const end = new Date(start);

      switch (plan.durationType) {
        case "days":
          end.setDate(end.getDate() + plan.duration);
          break;
        case "weeks":
          end.setDate(end.getDate() + plan.duration * 7);
          break;
        case "months":
          end.setMonth(end.getMonth() + plan.duration);
          break;
        case "years":
          end.setFullYear(end.getFullYear() + plan.duration);
          break;
      }
      calculatedEndDate = end;
    }

    // Fixed: Single check for existing active membership
    const existingMember = await Member.findOne({
      user: userId,
      status: "active",
      endDate: { $gte: new Date() },
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
      }
    }

    // Get the populated member data
    const populatedMember = await Member.findById(newMember._id)
      .populate("user", "firstName lastName email phone")
      .populate("membershipPlan", "name price duration durationType");

    console.log("Created member:", populatedMember.toJSON());
    
    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: {
        member: populatedMember,
        payment: payment,
      }
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