const Member = require("../models/Member");
const Session = require("../models/Session");

// Helper function to add stats to trainers
const addStatsToTrainers = async (trainers) => {
  if (!trainers.length) return [];

  const trainerIds = trainers.map((trainer) => trainer._id);

  // Aggregate member stats (total and active clients per trainer)
  const memberStats = await Member.aggregate([
    { $match: { trainers: { $in: trainerIds } } },
    { $unwind: "$trainers" },
    { $match: { trainers: { $in: trainerIds } } },
    {
      $group: {
        _id: "$trainers",
        totalClients: { $sum: 1 },
        activeClients: {
          $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
        },
      },
    },
  ]);

  // Aggregate session stats (total sessions per trainer)
  const sessionStats = await Session.aggregate([
    { $match: { trainer: { $in: trainerIds } } },
    {
      $group: {
        _id: "$trainer",
        totalSessions: { $sum: 1 },
      },
    },
  ]);

  // Get upcoming sessions for each trainer (scheduled sessions with date >= today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingSessions = await Session.find({
    trainer: { $in: trainerIds },
    date: { $gte: today },
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
    .limit(50); // Limit to avoid performance issues

  // Convert results to maps for quick lookup
  const memberStatsMap = {};
  memberStats.forEach((stat) => {
    memberStatsMap[stat._id.toString()] = stat;
  });

  const sessionStatsMap = {};
  sessionStats.forEach((stat) => {
    sessionStatsMap[stat._id.toString()] = stat;
  });

  // Group upcoming sessions by trainer
  const upcomingSessionsMap = {};
  upcomingSessions.forEach((session) => {
    const trainerId = session.trainer.toString();
    if (!upcomingSessionsMap[trainerId]) {
      upcomingSessionsMap[trainerId] = [];
    }
    upcomingSessionsMap[trainerId].push(session);
  });

  // Merge stats into trainers
  return trainers.map((trainer) => {
    const trainerId = trainer._id.toString();
    const trainerMemberStats = memberStatsMap[trainerId] || {};
    const trainerSessionStats = sessionStatsMap[trainerId] || {};

    return {
      ...trainer.toObject(),
      totalClients: trainerMemberStats.totalClients || 0,
      activeClients: trainerMemberStats.activeClients || 0,
      totalSessions: trainerSessionStats.totalSessions || 0,
      upcomingSessions: upcomingSessionsMap[trainerId] || [],
    };
  });
};

module.exports = { addStatsToTrainers };
