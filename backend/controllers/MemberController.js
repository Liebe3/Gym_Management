const Member = require("../models/Member");
const User = require("../models/User");
const MembershipPlan = require("../models/MemberShipPlan");
const Payment = require("../models/Payment");

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
      return res.status(404).json({ message: "Memebership plan not found" });
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

    // Check if user already has an active membership
    const existingMember = await Member.findOne({
      user: userId,
      status: "active",
      endDate: { $gte: new Date() }, // still valid
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
      status: status || "none",
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

      if (payment.status === "completed") {
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

        newMember.status = "active";
        await newMember.save();
      }
    }

    const populatedMember = await Member.findById(newMember._id)
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType");

    console.log(populatedMember.toJSON());
    res.status(201).json({
      message: "Member created successfully",
      member: populatedMember,
      payment: payment,
    });
  } catch (error) {
    console.error("Error creating member:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
