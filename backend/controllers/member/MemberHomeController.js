const Member = require("../../models/Member");
const Session = require("../../models/Session");

exports.getActiveMemberHomeData = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const member = await Member.findOne({ user: userId })
      .populate({
        path: "user",
        select: "firstName lastName email role",
      })
      .populate({
        path: "membershipPlan",
        select: "name price duration durationType description",
      })
      .populate({
        path: "trainers",
        select:
          "specializations experience workSchedule status isAvailableForNewClients",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "primaryTrainer",
        select:
          "specializations experience workSchedule status isAvailableForNewClients",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No active membership found for this user",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let membershipStatus = member.status;
    let daysRemaining = 0;
    let isExpired = false;
    let expiresAt = null;

    if (member.endDate) {
      const endDate = new Date(member.endDate);
      endDate.setHours(0, 0, 0, 0);

      if (endDate < today) {
        membershipStatus = "expired";
        isExpired = true;
      } else {
        const timeDiff = endDate.getTime() - today.getTime();
        daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        expiresAt = member.endDate;
      }
    }

    // Fetch recent sessions
    const recentSessions = await Session.find({ member: member._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "trainer",
        select: "specializations",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .select("date startTime endTime duration notes intensity status");

    // Fetch upcoming sessions (only 'scheduled', exclude 'completed' and 'cancelled')
    const upcomingSessions = await Session.find({
      member: member._id,
      date: { $gte: today },
      status: "scheduled",
    })
      .sort({ date: 1 })
      .limit(3)
      .populate({
        path: "trainer",
        select: "specializations",
        populate: {
          path: "user",
          select: "firstName lastName",
        },
      })
      .select("date startTime endTime duration notes intensity status");

    // Get top 3 trainers by session count
    const topTrainers = await Session.aggregate([
      { $group: { _id: "$trainer", sessionCount: { $sum: 1 } } },
      { $sort: { sessionCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "trainers",
          localField: "_id",
          foreignField: "_id",
          as: "trainerData",
        },
      },
      { $unwind: "$trainerData" },
      {
        $lookup: {
          from: "users",
          localField: "trainerData.user",
          foreignField: "_id",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $project: {
          _id: "$trainerData._id",
          firstName: "$userData.firstName",
          lastName: "$userData.lastName",
          specializations: "$trainerData.specializations",
          experience: "$trainerData.experience",
          workSchedule: "$trainerData.workSchedule",
          status: "$trainerData.status",
          isAvailableForNewClients: "$trainerData.isAvailableForNewClients",
          sessionCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        member: {
          _id: member._id,
          user: member.user,
          membershipPlan: member.membershipPlan,
          primaryTrainer: member.primaryTrainer,
          trainers: member.trainers,
          startDate: member.startDate,
          endDate: member.endDate,
          // autoRenew: member.autoRenew,
          createdAt: member.createdAt,
        },
        membershipStatus: {
          status: membershipStatus,
          isExpired,
          daysRemaining,
          expiresAt,
          // autoRenew: member.autoRenew,
        },
        sessions: {
          recent: recentSessions,
          upcoming: upcomingSessions,
        },
        stats: {
          totalSessions: await Session.countDocuments({
            member: member._id,
          }),
          completedSessions: await Session.countDocuments({
            member: member._id,
            status: "completed",
          }),
          upcomingCount: upcomingSessions.length,
        },
        topTrainers, // Add top trainers to response
      },
    });
  } catch (error) {
    console.error("Error fetching member home data:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAvailableTrainers = async (req, res) => {
  try {
    const Trainer = require("../../models/Trainer");

    // Get all trainers who are active and available for new clients
    const trainers = await Trainer.find({
      status: "active",
      isAvailableForNewClients: true,
    })
      .populate({
        path: "user",
        select: "firstName lastName email",
      })
      .select(
        "specializations experience workSchedule isAvailableForNewClients status"
      );

    res.status(200).json({
      success: true,
      data: trainers,
    });
  } catch (error) {
    console.error("Error fetching available trainers:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
