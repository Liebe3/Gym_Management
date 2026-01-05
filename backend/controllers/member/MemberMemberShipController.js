const Plan = require("../../models/MemberShipPlan");
const Member = require("../../models/Member");

// Get all membership plans and member's current plan
exports.getMemberMembershipPlan = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get all active membership plans sorted by price
    const allPlans = await Plan.find({ status: "active" }).sort({ price: 1 });

    // Get member's profile with populated membership plan
    const member = await Member.findOne({ user: userId })
      .populate("membershipPlan")
      .populate("user", "firstName lastName email");

    if (!member) {
      return res.status(200).json({
        success: true,
        message: "Membership plans fetched successfully",
        data: {
          allPlans,
          currentMembershipPlan: null,
          hasActivePlan: false,
        },
      });
    }

    // Check if member has an active membership plan
    const hasActivePlan = member.membershipPlan && member.membershipPlan.status === "active";

    return res.status(200).json({
      success: true,
      message: "Membership plans fetched successfully",
      data: {
        allPlans,
        currentMembershipPlan: member.membershipPlan || null,
        hasActivePlan,
        member: {
          id: member._id,
          name: `${member.user?.firstName || ""} ${member.user?.lastName || ""}`.trim(),
          email: member.user?.email || "",
        },
      },
    });
  } catch (error) {
    console.error("Error in getMemberMembershipPlan:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
