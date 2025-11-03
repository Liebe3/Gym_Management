const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyTrainer = require("../../middleware/VerifyTrainer");
const Member = require("../../models/Member");
const Session = require("../../models/Session");
const Trainer = require("../../models/Trainer");
const User = require("../../models/User");
const { buildCounts } = require("../../utils/aggregationHelper");

router.use(VerifyToken);
router.use(VerifyTrainer);

// Get trainer clients with filters and stats
router.get("/clients", async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      status, 
      search, 
      page = 1, 
      limit = 10,
      all = false
    } = req.query;

    // Find trainer by user ID
    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      return res.status(404).json({ 
        success: false, 
        message: "Trainer not found" 
      });
    }

    // Build filter
    const filter = { trainer: trainer._id };

    // Apply status filter
    if (status && status !== "all") {
      filter.status = status;
    }

    // Apply search filter
    if (search) {
      const userIds = await User.find({
        $or: [
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      filter.user = { $in: userIds.map((u) => u._id) };
    }

    // Pagination
    const isAll = all === 'true' || all === true;
    const pageNum = parseInt(page) || 1;
    const limitNum = isAll ? Number.MAX_SAFE_INTEGER : (parseInt(limit) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Fetch members with populated data
    const members = await Member.find(filter)
      .populate({
        path: "user",
        select: "firstName lastName email phone profilePicture",
      })
      .populate({
        path: "membershipPlan",
        select: "name price duration durationType",
      })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Member.countDocuments(filter);

    // Get next session for each member
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const memberIds = members.map((m) => m._id);
    
    const nextSessions = await Session.find({
      member: { $in: memberIds },
      trainer: trainer._id,
      date: { $gte: today },
      status: "scheduled",
    })
      .sort({ date: 1, startTime: 1 })
      .limit(memberIds.length);

    // Create map of member to next session
    const nextSessionMap = {};
    nextSessions.forEach((session) => {
      const memberId = session.member.toString();
      if (!nextSessionMap[memberId]) {
        nextSessionMap[memberId] = session;
      }
    });

    // Combine data
    const clientsData = members.map((member) => {
      const memberObj = member.toObject();
      const memberId = member._id.toString();
      
      return {
        ...memberObj,
        nextSession: nextSessionMap[memberId] || null,
      };
    });

    // Get status counts
    const statusCounts = await buildCounts(Member, "status", { trainer: trainer._id });

    // Calculate stats
    const totalClients = await Member.countDocuments({ trainer: trainer._id });
    const activeClients = await Member.countDocuments({ 
      trainer: trainer._id, 
      status: "active" 
    });
    const pendingClients = await Member.countDocuments({ 
      trainer: trainer._id, 
      status: "pending" 
    });
    const expiredClients = await Member.countDocuments({ 
      trainer: trainer._id, 
      status: "expired" 
    });

    res.status(200).json({
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
    res.status(500).json({ 
      success: false, 
      message: "Server Error",
      error: error.message 
    });
  }
});

// Get single client details
router.get("/clients/:memberId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { memberId } = req.params;

    const trainer = await Trainer.findOne({ user: userId });
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const member = await Member.findOne({
      _id: memberId,
      trainer: trainer._id,
    })
      .populate({
        path: "user",
        select: "firstName lastName email phone profilePicture",
      })
      .populate({
        path: "membershipPlan",
        select: "name price duration durationType features",
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Client not found or not assigned to this trainer",
      });
    }

    // Get session statistics
    const [totalSessions, completedSessions, upcomingSessions] = await Promise.all([
      Session.countDocuments({ member: memberId, trainer: trainer._id }),
      Session.countDocuments({ 
        member: memberId, 
        trainer: trainer._id, 
        status: "completed" 
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

    res.status(200).json({
      success: true,
      data: {
        ...member.toObject(),
        sessionStats: {
          totalSessions,
          completedSessions,
          upcomingSessions,
        },
      },
    });
  } catch (error) {
    console.error("Get client details error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

module.exports = router;