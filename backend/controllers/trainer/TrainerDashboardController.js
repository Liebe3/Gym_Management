const Session = require("../../models/Session");
const Member = require("../../models/Member");
const Trainer = require("../../models/Trainer");
const User = require("../../models/User");

exports.getTrainerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get trainer profile
    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const trainerId = trainer._id;

    // ===== 1. OVERVIEW STATS =====
    const totalClients = await Member.countDocuments({
      trainers: trainerId,
      status: "active",
    });

    const activeClients = await Member.countDocuments({
      trainers: trainerId,
      status: "active",
    });

    // Session stats
    const totalSessions = await Session.countDocuments({
      trainer: trainerId,
    });

    const completedSessions = await Session.countDocuments({
      trainer: trainerId,
      status: "completed",
    });

    const scheduledSessions = await Session.countDocuments({
      trainer: trainerId,
      status: "scheduled",
    });

    const cancelledSessions = await Session.countDocuments({
      trainer: trainerId,
      status: "cancelled",
    });

    // ===== 2. SESSIONS BY MONTH (Last 6 months) =====
    const monthlyData = await Session.aggregate([
      {
        $match: {
          trainer: trainerId,
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

    // ===== 3. SESSIONS BY STATUS (Pie/Doughnut Chart) =====
    const sessionsByStatus = await Session.aggregate([
      {
        $match: { trainer: trainerId },
      },
      {
        $group: {
          _id: "$status",
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

    // ===== 4. UPCOMING SESSIONS =====
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const upcomingSessions = await Session.find({
      trainer: trainerId,
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
      .sort({ date: 1, startTime: 1 })
      .limit(10);

    // ===== 5. TOP CLIENTS (by session count) =====
    const topClients = await Session.aggregate([
      {
        $match: { trainer: trainerId },
      },
      {
        $group: {
          _id: "$member",
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 5 },
    ]);

    // Populate client details
    const topClientsData = await Member.find({
      _id: { $in: topClients.map((c) => c._id) },
    }).populate({
      path: "user",
      select: "firstName lastName email",
    });

    const topClientsWithSessions = topClients.map((topClient) => {
      const member = topClientsData.find(
        (m) => m._id.toString() === topClient._id.toString()
      );
      return {
        ...topClient,
        member: member,
        name: member
          ? `${member.user.firstName} ${member.user.lastName}`
          : "Unknown",
      };
    });

    // ===== 6. WEEKLY SESSION DISTRIBUTION =====
    const todayWeek = new Date();
    const startOfWeek = new Date(
      todayWeek.setDate(todayWeek.getDate() - todayWeek.getDay())
    );

    const weeklyData = await Session.aggregate([
      {
        $match: {
          trainer: trainerId,
          date: { $gte: startOfWeek },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$date" }, // 1=Sunday, 7=Saturday
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

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalClients,
          activeClients,
          totalSessions,
          completedSessions,
          scheduledSessions,
          cancelledSessions,
        },
        monthlyChart: {
          labels: Object.keys(chartData),
          data: Object.values(chartData),
        },
        statusChart: {
          labels: ["Scheduled", "Completed", "Cancelled"],
          data: [
            statusData.scheduled,
            statusData.completed,
            statusData.cancelled,
          ],
        },
        weeklyChart: {
          labels: Object.keys(weeklyChartData),
          data: Object.values(weeklyChartData),
        },
        upcomingSessions,
        topClients: topClientsWithSessions,
      },
    });
  } catch (error) {
    console.error("Get trainer dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
