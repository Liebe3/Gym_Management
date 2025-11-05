const Member = require("../../models/Member");
const Session = require("../../models/Session");
const Trainer = require("../../models/Trainer");
const User = require("../../models/User");
const { buildCounts } = require("../../utils/aggregationHelper");

// GET Trainer Clients
exports.getTrainerClients = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, search, page = 1, limit = 10, all = false } = req.query;

    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const filter = { trainer: trainer._id };

    if (status && status !== "all") filter.status = status;

    if (search) {
      const userIds = await User.find({
        $or: [
          { firstName: new RegExp(search, "i") },
          { lastName: new RegExp(search, "i") },
          { email: new RegExp(search, "i") },
        ],
      }).select("_id");

      filter.user = { $in: userIds.map((u) => u._id) };
    }

    const isAll = all === "true" || all === true;
    const pageNum = parseInt(page);
    const limitNum = isAll ? Number.MAX_SAFE_INTEGER : parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const members = await Member.find(filter)
      .populate("user", "firstName lastName email")
      .populate("membershipPlan", "name price duration durationType")
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Member.countDocuments(filter);

    // Fetch next sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const memberIds = members.map((m) => m._id);

    const nextSessions = await Session.find({
      member: { $in: memberIds },
      trainer: trainer._id,
      date: { $gte: today },
      status: "scheduled",
    }).sort({ date: 1, startTime: 1 });

    const nextSessionMap = {};
    nextSessions.forEach((session) => {
      const memberId = session.member.toString();
      if (!nextSessionMap[memberId]) nextSessionMap[memberId] = session;
    });

    const clientsData = members.map((member) => ({
      ...member.toObject(),
      nextSession: nextSessionMap[member._id.toString()] || null,
    }));

    const statusCounts = await buildCounts(Member, "status", {
      trainer: trainer._id,
    });

    const [totalClients, activeClients, pendingClients, expiredClients] =
      await Promise.all([
        Member.countDocuments({ trainer: trainer._id }),
        Member.countDocuments({ trainer: trainer._id, status: "active" }),
        Member.countDocuments({ trainer: trainer._id, status: "pending" }),
        Member.countDocuments({ trainer: trainer._id, status: "expired" }),
      ]);

    return res.json({
      success: true,
      data: clientsData,
      pagination: {
        currentPage: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      stats: {
        totalClients,
        activeClients,
        pendingClients,
        expiredClients,
      },
      counts: statusCounts,
    });
  } catch (error) {
    console.error("Get trainer clients error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  GET Individual Client
exports.getClientDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;

    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    const member = await Member.findOne({ _id: memberId, trainer: trainer._id })
      .populate("user", "firstName lastName email phone profilePicture")
      .populate("membershipPlan", "name price duration durationType features");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Client not found or not assigned to this trainer",
      });
    }

    const [totalSessions, completedSessions, upcomingSessions] =
      await Promise.all([
        Session.countDocuments({ member: memberId, trainer: trainer._id }),
        Session.countDocuments({
          member: memberId,
          trainer: trainer._id,
          status: "completed",
        }),
        Session.find({
          member: memberId,
          trainer: trainer._id,
          date: { $gte: new Date() },
          status: "scheduled",
        })
          .sort({ date: 1, startTime: 1 })
          .limit(5),
      ]);

    res.json({
      success: true,
      data: {
        ...member.toObject(),
        nextSession: upcomingSessions[0] || null,
        sessionStats: {
          totalSessions,
          completedSessions,
          upcomingSessions,
        },
      },
    });
  } catch (error) {
    console.error("Get client details error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
