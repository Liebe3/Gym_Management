const Session = require("../models/Session");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const { getAll } = require("./BaseController");

exports.getAllSessions = async (req, res) => {
  return getAll(Session, req, res, {
    filterableFields: {
      status: "status",
      trainer: "trainer",
      member: "member",
    },
    populate: [
      {
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
      {
        path: "member",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      },
    ],
    countableFields: ["status"],
    defaultSort: { date: -1 },
  });
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id)
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email phone",
        },
      })
      .populate({
        path: "member",
        populate: [
          {
            path: "user",
            select: "firstName lastName email phone",
          },
          {
            path: "membershipPlan",
            select: "name price duration durationType",
          },
        ],
      });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get session by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getTrainerSessions = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    const filter = { trainer: trainerId };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await Session.find(filter)
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get trainer sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getMemberSessions = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const filter = { member: memberId };

    if (status && status !== "all") {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const sessions = await Session.find(filter)
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Session.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: sessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get member sessions error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { trainerId, memberId, date, status, notes } = req.body;

    // Validate required fields
    if (!trainerId || !memberId || !date) {
      return res.status(400).json({
        success: false,
        message: "Trainer ID, Member ID, and date are required",
      });
    }

    // Validate trainer exists and is active
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    if (trainer.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Trainer is not active",
      });
    }

    // Validate member exists and has active membership
    const member = await Member.findById(memberId).populate("user");
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    if (member.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Member does not have an active membership",
      });
    }

    // Validate date is not in the past
    const sessionDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sessionDate < today) {
      return res.status(400).json({
        success: false,
        message: "Session date cannot be in the past",
      });
    }

    // Check if trainer is available on the session date
    const dayOfWeek = sessionDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const trainerSchedule = trainer.workSchedule[dayOfWeek];

    if (!trainerSchedule || !trainerSchedule.isWorking) {
      return res.status(400).json({
        success: false,
        message: `Trainer is not available on ${dayOfWeek}s`,
      });
    }

    // Check for conflicting sessions
    const conflictingSession = await Session.findOne({
      trainer: trainerId,
      date: sessionDate,
      status: { $in: ["scheduled", "completed"] },
    });

    if (conflictingSession) {
      return res.status(400).json({
        success: false,
        message: "Trainer already has a session scheduled at this time",
      });
    }

    // Create new session
    const newSession = new Session({
      trainer: trainerId,
      member: memberId,
      date: sessionDate,
      status: status || "scheduled",
      notes: notes || "",
    });

    await newSession.save();

    // Populate the session before sending response
    const populatedSession = await Session.findById(newSession._id)
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: populatedSession,
    });
  } catch (error) {
    console.error("Error creating session:", error);

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

exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status, notes } = req.body;

    const existingSession = await Session.findById(id);
    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const updateData = {};

    // Validate and update date
    if (date !== undefined) {
      const newDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newDate < today && existingSession.status === "scheduled") {
        return res.status(400).json({
          success: false,
          message: "Cannot reschedule to a past date",
        });
      }

      // Check for conflicts if rescheduling
      if (newDate.getTime() !== existingSession.date.getTime()) {
        const conflictingSession = await Session.findOne({
          _id: { $ne: id },
          trainer: existingSession.trainer,
          date: newDate,
          status: { $in: ["scheduled", "completed"] },
        });

        if (conflictingSession) {
          return res.status(400).json({
            success: false,
            message: "Trainer already has a session at this time",
          });
        }
      }

      updateData.date = newDate;
    }

    // Validate and update status
    if (status !== undefined) {
      const validStatuses = ["scheduled", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        });
      }
      updateData.status = status;
    }

    // Update notes
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedSession = await Session.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate({
        path: "trainer",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "member",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: updatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);

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

exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSession = await Session.findByIdAndDelete(id);

    if (!deletedSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
