const Session = require("../models/Session");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const User = require("../models/User");

exports.getAdminDashboard = async (req, res) => {
  try {
    // OVERVIEW STATS 
    const totalUsers = await User.countDocuments();
    const totalMembers = await Member.countDocuments();
    const totalTrainers = await Trainer.countDocuments();
    const activeMembers = await Member.countDocuments({ status: "active" });
    const expiredMembers = await Member.countDocuments({ status: "expired" });

    // Session stats
    const totalSessions = await Session.countDocuments();
    const completedSessions = await Session.countDocuments({
      status: "completed",
    });
    const scheduledSessions = await Session.countDocuments({
      status: "scheduled",
    });
    const cancelledSessions = await Session.countDocuments({
      status: {
        $in: [
          "cancelled_by_member",
          "cancelled_by_trainer",
          "cancelled_by_admin",
        ],
      },
    });

    // Revenue stats - Calculate based on active members
    const activeMembersRevenue = await Member.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $lookup: {
          from: "membershipplans",
          localField: "membershipPlan",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$plan.price" },
        },
      },
    ]);

    const revenue =
      activeMembersRevenue.length > 0 ? activeMembersRevenue[0].total : 0;

    // SESSIONS BY MONTH 
    const monthlyData = await Session.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Format monthly data for chart
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const chartData = {};
    const today = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      chartData[key] = 0;
    }

    // Fill in actual data
    monthlyData.forEach(({ _id, count }) => {
      const monthName = monthNames[_id.month - 1];
      const key = `${monthName} ${_id.year}`;
      if (chartData.hasOwnProperty(key)) {
        chartData[key] = count;
      }
    });

    // SESSIONS BY STATUS 
    const sessionsByStatus = await Session.aggregate([
      {
        $group: {
          _id: {
            $cond: [
              {
                $in: [
                  "$status",
                  [
                    "cancelled_by_member",
                    "cancelled_by_trainer",
                    "cancelled_by_admin",
                  ],
                ],
              },
              "cancelled",
              "$status",
            ],
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const statusData = {
      scheduled: 0,
      completed: 0,
      cancelled: 0,
    };

    sessionsByStatus.forEach(({ _id, count }) => {
      if (statusData.hasOwnProperty(_id)) {
        statusData[_id] = count;
      }
    });

    // MEMBERS BY STATUS 
    const membersByStatus = await Member.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const memberStatusData = {
      active: 0,
      expired: 0,
    };

    membersByStatus.forEach(({ _id, count }) => {
      if (memberStatusData.hasOwnProperty(_id)) {
        memberStatusData[_id] = count;
      }
    });

    // REVENUE BY MONTH
    const monthlyRevenue = await Member.aggregate([
      {
        $match: {
          status: "active",
          startDate: {
            $lte: new Date(),
          },
          endDate: {
            $gte: new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $lookup: {
          from: "membershipplans",
          localField: "membershipPlan",
          foreignField: "_id",
          as: "plan",
        },
      },
      {
        $unwind: "$plan",
      },
      {
        $group: {
          _id: {
            year: { $year: "$startDate" },
            month: { $month: "$startDate" },
          },
          total: { $sum: "$plan.price" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const revenueChartData = {};

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      revenueChartData[key] = 0;
    }

    // Fill in actual revenue data
    monthlyRevenue.forEach(({ _id, total }) => {
      const monthName = monthNames[_id.month - 1];
      const key = `${monthName} ${_id.year}`;
      if (revenueChartData.hasOwnProperty(key)) {
        revenueChartData[key] = total;
      }
    });

    // TOP TRAINERS - by sessions 
    const topTrainers = await Session.aggregate([
      {
        $group: {
          _id: "$trainer",
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate trainer details
    const topTrainersData = await Trainer.find({
      _id: { $in: topTrainers.map((t) => t._id) },
    }).populate({
      path: "user",
      select: "firstName lastName email",
    });

    const topTrainersWithSessions = topTrainers.map((topTrainer) => {
      const trainer = topTrainersData.find(
        (t) => t._id.toString() === topTrainer._id.toString()
      );
      return {
        ...topTrainer,
        trainer: trainer,
        name: trainer
          ? `${trainer.user.firstName} ${trainer.user.lastName}`
          : "Unknown",
      };
    });

    // WEEKLY SESSION DISTRIBUTION 
    const todayWeek = new Date();
    const startOfWeek = new Date(
      todayWeek.setDate(todayWeek.getDate() - todayWeek.getDay())
    );

    const weeklyData = await Session.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" }, 
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeklyChartData = {};
    daysOfWeek.forEach((day) => {
      weeklyChartData[day] = 0;
    });

    weeklyData.forEach(({ _id, count }) => {
      weeklyChartData[daysOfWeek[_id - 1]] = count;
    });

    // RECENT SESSIONS 
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const recentSessions = await Session.find({
      date: { $gte: todayDate },
      status: "scheduled",
    })
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .sort({ date: 1, startTime: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalMembers,
          totalTrainers,
          activeMembers,
          expiredMembers,
          totalSessions,
          completedSessions,
          scheduledSessions,
          cancelledSessions,
          revenue,
        },
        monthlyChart: {
          labels: Object.keys(chartData),
          data: Object.values(chartData),
        },
        sessionStatusChart: {
          labels: ["Scheduled", "Completed", "Cancelled"],
          data: [
            statusData.scheduled,
            statusData.completed,
            statusData.cancelled,
          ],
        },
        memberStatusChart: {
          labels: ["Active", "Expired"],
          data: [memberStatusData.active, memberStatusData.expired],
        },
        revenueChart: {
          labels: Object.keys(revenueChartData),
          data: Object.values(revenueChartData),
        },
        weeklyChart: {
          labels: Object.keys(weeklyChartData),
          data: Object.values(weeklyChartData),
        },
        topTrainers: topTrainersWithSessions,
        recentSessions,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({
      success: true,
      message: "Server Error",
      error: error.message,
    });
  }
};
