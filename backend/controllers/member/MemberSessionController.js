const Member = require("../../models/Member");
const Session = require("../../models/Session");
const Trainer = require("../../models/Trainer");

const {
  validateSessionTimeRange,
  formatTo12Hour,
} = require("../SessionController");

exports.getUpcomingSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find member by user ID
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "No active membership found for this user",
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      member: member._id,
      date: { $gte: today },
      status: "scheduled",
    };

    // Get total count for pagination
    const totalRecords = await Session.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch upcoming sessions with pagination
    const upcomingSessions = await Session.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "trainer",
        select: "specializations experience status isAvailableForNewClients",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .select("date startTime endTime notes status");

    // Format the response to include trainer name in a cleaner format
    const formattedSessions = upcomingSessions.map((session) => {
      const sessionObj = session.toObject ? session.toObject() : session;

      return {
        _id: sessionObj._id,
        date: sessionObj.date,
        startTime: sessionObj.startTime,
        endTime: sessionObj.endTime,
        trainerName: sessionObj.trainer?.user
          ? `${sessionObj.trainer.user.firstName} ${sessionObj.trainer.user.lastName}`
          : "Not assigned",
        notes: sessionObj.notes || "",
        status: sessionObj.status,
        // Include full trainer object if needed for additional details
        trainer: sessionObj.trainer,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedSessions.length,
      data: formattedSessions,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching upcoming sessions:", error);

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

// MEMBER PANEL - Book a session with a trainer
exports.bookSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    // Check if member has active membership
    if (member.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "Your membership is not active. Please renew your membership to book sessions.",
      });
    }

    const { trainerId, date, startTime, endTime, notes } = req.body;

    // Validate required fields
    if (!trainerId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Trainer ID, date, start time, and end time are required",
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM (24-hour format)",
      });
    }

    // Validate end time is after start time
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // Check if trainer exists and is available
    const trainer = await Trainer.findById(trainerId).populate("user");
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Check trainer availability status (active status + available for new clients)
    if (trainer.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This trainer is not currently active",
      });
    }

    if (!trainer.isAvailableForNewClients) {
      return res.status(400).json({
        success: false,
        message:
          "This trainer is currently not available for new sessions. Please select another trainer.",
      });
    }

    // Check if member is assigned to this trainer
    const isAssignedToTrainer =
      member.trainers?.some((t) => t.toString() === trainerId) ||
      member.primaryTrainer?.toString() === trainerId;

    if (!isAssignedToTrainer) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this trainer. Please request to be assigned first.",
      });
    }

    // Parse and validate session date
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sessionDate < today) {
      return res.status(400).json({
        success: false,
        message: "Session date cannot be in the past",
      });
    }

    // Check trainer's availability on the requested day
    const dayOfWeek = sessionDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const trainerSchedule = trainer.workSchedule[dayOfWeek];

    if (!trainerSchedule || !trainerSchedule.isWorking) {
      return res.status(400).json({
        success: false,
        message: `${trainer.user.firstName} is not available on ${dayOfWeek}s`,
      });
    }

    // Check if session time is within trainer's working hours
    if (!validateSessionTimeRange(startTime, endTime, trainerSchedule)) {
      return res.status(400).json({
        success: false,
        message: `Session time ${formatTo12Hour(startTime)} - ${formatTo12Hour(
          endTime
        )} is outside ${
          trainer.user.firstName
        }'s working hours (${formatTo12Hour(
          trainerSchedule.startTime
        )} - ${formatTo12Hour(trainerSchedule.endTime)})`,
      });
    }

    // Check for available slot - no conflicting sessions for the member with ANY trainer
    // Only check scheduled sessions, not completed ones
    const memberConflictingSessions = await Session.find({
      member: member._id,
      date: sessionDate,
      status: "scheduled",
    });

    for (const existingSession of memberConflictingSessions) {
      const [existingStartHour, existingStartMin] = existingSession.startTime
        .split(":")
        .map(Number);
      const [existingEndHour, existingEndMin] = existingSession.endTime
        .split(":")
        .map(Number);

      const existingStartMinutes = existingStartHour * 60 + existingStartMin;
      const existingEndMinutes = existingEndHour * 60 + existingEndMin;

      // Check if times overlap
      const hasOverlap =
        (startMinutes >= existingStartMinutes &&
          startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes &&
          endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes &&
          endMinutes >= existingEndMinutes);

      if (hasOverlap) {
        const existingTrainer = await Trainer.findById(
          existingSession.trainer
        ).populate("user");
        return res.status(400).json({
          success: false,
          message: `You already have a session with ${
            existingTrainer.user.firstName
          } ${existingTrainer.user.lastName} from ${formatTo12Hour(
            existingSession.startTime
          )} to ${formatTo12Hour(existingSession.endTime)} on this date`,
        });
      }
    }

    // Check for available slot - no conflicting sessions for the trainer (only 'scheduled' sessions)
    const trainerConflictingSessions = await Session.find({
      trainer: trainerId,
      date: sessionDate,
      status: "scheduled",
    });

    for (const existingSession of trainerConflictingSessions) {
      const [existingStartHour, existingStartMin] = existingSession.startTime
        .split(":")
        .map(Number);
      const [existingEndHour, existingEndMin] = existingSession.endTime
        .split(":")
        .map(Number);

      const existingStartMinutes = existingStartHour * 60 + existingStartMin;
      const existingEndMinutes = existingEndHour * 60 + existingEndMin;

      // Check if times overlap
      const hasOverlap =
        (startMinutes >= existingStartMinutes &&
          startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes &&
          endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes &&
          endMinutes >= existingEndMinutes);

      if (hasOverlap) {
        return res.status(400).json({
          success: false,
          message: `${
            trainer.user.firstName
          } is not available from ${formatTo12Hour(
            existingSession.startTime
          )} to ${formatTo12Hour(
            existingSession.endTime
          )} on this date. Please choose a different time slot.`,
        });
      }
    }

    // Create the session
    const newSession = new Session({
      trainer: trainerId,
      member: member._id,
      date: sessionDate,
      startTime: startTime,
      endTime: endTime,
      status: "scheduled",
      notes: notes || "",
    });

    await newSession.save();

    // Populate the session with trainer and member details
    const populatedSession = await Session.findById(newSession._id).populate({
      path: "trainer",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    });

    res.status(201).json({
      success: true,
      message: "Session booked successfully!",
      data: populatedSession,
    });
  } catch (error) {
    console.error("Error booking session:", error);

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

// MEMBER PANEL - Get trainers assigned to the member
exports.getAssignedTrainers = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find member by user ID
    const member = await Member.findOne({ user: userId })
      .populate({
        path: "trainers",
        select: "specializations experience status isAvailableForNewClients",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "primaryTrainer",
        select: "specializations experience status isAvailableForNewClients",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    // Format the response - include all trainers regardless of status
    const formattedTrainers = member.trainers.map((trainer) => {
      const trainerObj = trainer.toObject ? trainer.toObject() : trainer;
      return {
        _id: trainerObj._id,
        firstName: trainerObj.user?.firstName || "",
        lastName: trainerObj.user?.lastName || "",
        email: trainerObj.user?.email || "",
        specializations: trainerObj.specializations || [],
        experience: trainerObj.experience || 0,
        status: trainerObj.status,
        isAvailableForNewClients: trainerObj.isAvailableForNewClients,
        isPrimary:
          member.primaryTrainer?._id?.toString() === trainerObj._id?.toString(),
      };
    });

    res.status(200).json({
      success: true,
      count: formattedTrainers.length,
      data: formattedTrainers,
    });
  } catch (error) {
    console.error("Error fetching assigned trainers:", error);

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

// MEMBER PANEL - Cancel a scheduled session
exports.cancelSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { cancellationReason } = req.body;

    // Validate sessionId
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    // Find member by user ID
    const member = await Member.findOne({ user: userId });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found",
      });
    }

    // Find the session
    const session = await Session.findById(sessionId).populate({
      path: "trainer",
      populate: {
        path: "user",
        select: "firstName lastName",
      },
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    // Verify the session belongs to the member
    if (session.member.toString() !== member._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this session",
      });
    }

    // Handle past sessions explicitly
    const now = new Date();
    if (new Date(session.date) < now && session.status !== "upcoming") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel past sessions",
      });
    }

    // Check if session is within 2 hours
    const sessionDateTime = new Date(session.date);
    const [sessionHour, sessionMin] = session.startTime.split(":").map(Number);
    sessionDateTime.setHours(sessionHour, sessionMin, 0, 0);

    const timeDifference = (sessionDateTime - now) / (1000 * 60); // in minutes

    if (timeDifference < 120) {
      // Less than 2 hours
      return res.status(400).json({
        success: false,
        message: "Cannot cancel sessions within 2 hours of the start time",
      });
    }

    // Update session status and cancellation reason
    session.status = "cancelled_by_member";
    session.cancellationReason = cancellationReason || "";

    await session.save();

    // Populate trainer details for response
    const populatedSession = await Session.findById(session._id).populate({
      path: "trainer",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    });

    res.status(200).json({
      success: true,
      message: "Session cancelled successfully",
      data: populatedSession,
    });
  } catch (error) {
    console.error("Error cancelling session:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid session ID format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
