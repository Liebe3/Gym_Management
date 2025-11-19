const cron = require("node-cron");
const Member = require("../models/Member");
const User = require("../models/User");

/**
 * Check and update expired memberships
 * This function finds all active memberships that have passed their end date
 * and updates them to expired status
 */
const checkExpiredMemberships = async () => {
  try {
    // Manila timezone today at midnight
    const today = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    });
    const manilaDate = new Date(today);
    manilaDate.setHours(0, 0, 0, 0);

    // console.log(
    //   `[${new Date().toISOString()}] Checking for expired memberships...`
    // );

    const expiredMembers = await Member.find({
      status: "active",
      endDate: { $lt: manilaDate },
    }).populate("user", "firstName lastName email role");

    if (!expiredMembers.length) {
      console.log("No expired memberships found.");
      return { count: 0, updated: [] };
    }

    console.log(
      `Found ${expiredMembers.length} expired membership(s). Updating...`
    );

    const updatedMembers = [];

    for (const member of expiredMembers) {
      member.status = "expired";
      await member.save();

      updatedMembers.push({
        memberId: member._id,
        userId: member.user._id,
        userEmail: member.user.email,
      });

      console.log(`- Expired membership for user: ${member.user.email}`);

      const otherActiveMembership = await Member.findOne({
        user: member.user._id,
        _id: { $ne: member._id },
        status: "active",
        endDate: { $gte: manilaDate },
      });

      if (!otherActiveMembership && member.user.role === "member") {
        await User.findByIdAndUpdate(member.user._id, { role: "user" });
        console.log(`User role changed from 'member' to 'user'`);
      }
    }

    console.log(
      `Successfully updated ${expiredMembers.length} expired membership(s)\n`
    );

    return { count: expiredMembers.length, updated: updatedMembers };
  } catch (error) {
    console.error("Error checking expired memberships:", error);
    throw error;
  }
}; 

/**
 * Start the membership expiration scheduler
 * Runs every day at midnight (00:00)
 */
const startMembershipScheduler = () => {
  // Schedule: Run every day at midnight
  // Format: second minute hour day month weekday

  cron.schedule("0 0 * * *", () => {
    console.log("Running scheduled membership expiration check");
    checkExpiredMemberships();
  });

  // Run immediately on startup to catch any missed expirations
  console.log("Running initial membership expiration check...");
  checkExpiredMemberships();
};

/*
 * Manual function to trigger membership expiration check
 * Useful for testing or manual triggers via API endpoint
 * uncomment if needeed.
 */

// const manualExpirationCheck = async (req, res) => {
//   try {
//     const result = await checkExpiredMemberships();
//     res.status(200).json({
//       success: true,
//       message: "Membership expiration check completed successfully",
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error checking expired memberships",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  startMembershipScheduler,
  checkExpiredMemberships,
  // manualExpirationCheck,
};


