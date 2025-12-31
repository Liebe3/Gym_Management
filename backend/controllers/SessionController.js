const Session = require("../models/Session");
const Member = require("../models/Member");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { getAll } = require("./BaseController");

// Helper function to validate session time range against trainer schedule
const validateSessionTimeRange = (startTime, endTime, trainerSchedule) => {
  const [sessionStartHour, sessionStartMin] = startTime.split(":").map(Number);
  const [sessionEndHour, sessionEndMin] = endTime.split(":").map(Number);

  const sessionStartMinutes = sessionStartHour * 60 + sessionStartMin;
  const sessionEndMinutes = sessionEndHour * 60 + sessionEndMin;

  const [scheduleStartHour, scheduleStartMin] = trainerSchedule.startTime
    .split(":")
    .map(Number);
  const [scheduleEndHour, scheduleEndMin] = trainerSchedule.endTime
    .split(":")
    .map(Number);

  const scheduleStartMinutes = scheduleStartHour * 60 + scheduleStartMin;
  const scheduleEndMinutes = scheduleEndHour * 60 + scheduleEndMin;

  // Session must start >= schedule start AND end <= schedule end
  return (
    sessionStartMinutes >= scheduleStartMinutes &&
    sessionEndMinutes <= scheduleEndMinutes
  );
};

// Helper to format 24-hour time to 12-hour format with AM/PM
const formatTo12Hour = (time24) => {
  if (!time24) return "";
  const [hour, minute] = time24.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// Export helper functions for use in other controllers
module.exports.validateSessionTimeRange = validateSessionTimeRange;
module.exports.formatTo12Hour = formatTo12Hour;

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
          select: "firstName lastName email",
        },
      })
      .populate({
        path: "member",
        populate: [
          {
            path: "user",
            select: "firstName lastName email",
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
      if (status === "cancelled") {
        // Match all cancellation types
        filter.status = {
          $in: [
            "cancelled_by_member",
            "cancelled_by_trainer",
            "cancelled_by_admin",
          ],
        };
      } else {
        filter.status = status;
      }
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
      if (status === "cancelled") {
        // Match all cancellation types
        filter.status = {
          $in: [
            "cancelled_by_member",
            "cancelled_by_trainer",
            "cancelled_by_admin",
          ],
        };
      } else {
        filter.status = status;
      }
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
    const { trainerId, memberId, date, startTime, endTime, status, notes } =
      req.body;

    // Validate required fields
    if (!trainerId || !memberId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          "Trainer ID, Member ID, date, start time, and end time are required",
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid start time format. Use HH:MM (24-hour format)",
      });
    }

    if (!timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid end time format. Use HH:MM (24-hour format)",
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

    // Check if member is assigned to this trainer
    const isAssignedToTrainer =
      member.trainers?.some((t) => t.toString() === trainerId) ||
      member.primaryTrainer?.toString() === trainerId;

    if (!isAssignedToTrainer) {
      return res.status(400).json({
        success: false,
        message:
          "This member is not assigned to the selected trainer. Please select a member assigned to this trainer.",
      });
    }

    // Parse session date (keep time as 00:00:00 to avoid timezone issues)
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0);

    // Validate date is not in the past
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

    // Validate session time range is within trainer's work schedule
    if (!validateSessionTimeRange(startTime, endTime, trainerSchedule)) {
      return res.status(400).json({
        success: false,
        message: `Session time ${formatTo12Hour(startTime)} - ${formatTo12Hour(
          endTime
        )} is outside trainer's working hours (${formatTo12Hour(
          trainerSchedule.startTime
        )} - ${formatTo12Hour(trainerSchedule.endTime)})`,
      });
    }

    // Check for overlapping sessions for the same member (with ANY trainer)
    const memberOverlappingSessions = await Session.find({
      member: memberId,
      date: sessionDate,
      status: { $in: ["scheduled", "completed"] },
    });

    for (const existingSession of memberOverlappingSessions) {
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
        const trainerName = await Trainer.findById(
          existingSession.trainer
        ).populate("user", "firstName lastName");
        return res.status(400).json({
          success: false,
          message: `Member already has a session with ${
            trainerName.user.firstName
          } ${trainerName.user.lastName} scheduled from ${formatTo12Hour(
            existingSession.startTime
          )} to ${formatTo12Hour(existingSession.endTime)} on this date`,
        });
      }
    }

    // Check for overlapping sessions for the trainer (trainer availability)
    // Only check against 'scheduled' status, not 'completed'
    // This allows other trainers to schedule at the same time if your session is completed
    const trainerOverlappingSessions = await Session.find({
      trainer: trainerId,
      date: sessionDate,
      status: "scheduled",
    });

    for (const existingSession of trainerOverlappingSessions) {
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
          message: `Trainer already has a session scheduled from ${formatTo12Hour(
            existingSession.startTime
          )} to ${formatTo12Hour(existingSession.endTime)}`,
        });
      }
    }

    // Create new session
    const newSession = new Session({
      trainer: trainerId,
      member: memberId,
      date: sessionDate,
      startTime: startTime,
      endTime: endTime,
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
    const { date, startTime, endTime, status, notes } = req.body;

    const existingSession = await Session.findById(id).populate("trainer");
    if (!existingSession) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const updateData = {};

    // Check if session date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDate = new Date(existingSession.date);
    sessionDate.setHours(0, 0, 0, 0);
    const isDatePast = sessionDate < today;

    // Check if date/time values are actually being changed (not just resending same values)
    let isDateChanged = false;
    if (date !== undefined) {
      const incomingDate = new Date(date);
      incomingDate.setHours(0, 0, 0, 0);
      const existingDateOnly = new Date(existingSession.date);
      existingDateOnly.setHours(0, 0, 0, 0);
      isDateChanged = incomingDate.getTime() !== existingDateOnly.getTime();
    }
    const isStartTimeChanged =
      startTime !== undefined && startTime !== existingSession.startTime;
    const isEndTimeChanged =
      endTime !== undefined && endTime !== existingSession.endTime;

    // If date is past, block actual changes to date/time
    if (
      isDatePast &&
      (isDateChanged || isStartTimeChanged || isEndTimeChanged)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot modify date or time for past sessions. You can only update status and notes.",
      });
    }

    if (!isDatePast) {
      // For future/current sessions, validate date, time, and schedule changes
      const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d)$/;

      if (startTime && !timeRegex.test(startTime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid start time format. Use HH:MM (24-hour format)",
        });
      }

      if (endTime && !timeRegex.test(endTime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid end time format. Use HH:MM (24-hour format)",
        });
      }

      // Get the final start/end times (use existing if not provided)
      const finalStartTime = startTime || existingSession.startTime;
      const finalEndTime = endTime || existingSession.endTime;

      // Validate end time is after start time
      const [startHour, startMin] = finalStartTime.split(":").map(Number);
      const [endHour, endMin] = finalEndTime.split(":").map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        return res.status(400).json({
          success: false,
          message: "End time must be after start time",
        });
      }

      // Validate and update date
      if (date !== undefined) {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);

        if (newDate < today) {
          return res.status(400).json({
            success: false,
            message: "Cannot schedule to a past date",
          });
        }

        updateData.date = newDate;
      }

      const finalDate = updateData.date || existingSession.date;

      // Validate against trainer's work schedule
      const dayOfWeek = finalDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const trainerSchedule = existingSession.trainer.workSchedule[dayOfWeek];

      if (!trainerSchedule || !trainerSchedule.isWorking) {
        return res.status(400).json({
          success: false,
          message: `Trainer is not available on ${dayOfWeek}s`,
        });
      }

      if (
        !validateSessionTimeRange(finalStartTime, finalEndTime, trainerSchedule)
      ) {
        return res.status(400).json({
          success: false,
          message: `Session time ${formatTo12Hour(
            finalStartTime
          )} - ${formatTo12Hour(
            finalEndTime
          )} is outside trainer's working hours (${formatTo12Hour(
            trainerSchedule.startTime
          )} - ${formatTo12Hour(trainerSchedule.endTime)})`,
        });
      }

      // Check for overlapping sessions (excluding current session)
      const overlappingSessions = await Session.find({
        _id: { $ne: id },
        trainer: existingSession.trainer._id,
        date: finalDate,
        status: { $in: ["scheduled", "completed"] },
      });

      const [startHour2, startMin2] = finalStartTime.split(":").map(Number);
      const [endHour2, endMin2] = finalEndTime.split(":").map(Number);
      const startMinutes2 = startHour2 * 60 + startMin2;
      const endMinutes2 = endHour2 * 60 + endMin2;

      for (const otherSession of overlappingSessions) {
        const [otherStartHour, otherStartMin] = otherSession.startTime
          .split(":")
          .map(Number);
        const [otherEndHour, otherEndMin] = otherSession.endTime
          .split(":")
          .map(Number);

        const otherStartMinutes = otherStartHour * 60 + otherStartMin;
        const otherEndMinutes = otherEndHour * 60 + otherEndMin;

        const hasOverlap =
          (startMinutes2 >= otherStartMinutes &&
            startMinutes2 < otherEndMinutes) ||
          (endMinutes2 > otherStartMinutes && endMinutes2 <= otherEndMinutes) ||
          (startMinutes2 <= otherStartMinutes &&
            endMinutes2 >= otherEndMinutes);

        if (hasOverlap) {
          return res.status(400).json({
            success: false,
            message: `Trainer already has a session scheduled from ${formatTo12Hour(
              otherSession.startTime
            )} to ${formatTo12Hour(otherSession.endTime)}`,
          });
        }
      }

      if (startTime) updateData.startTime = startTime;
      if (endTime) updateData.endTime = endTime;
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
