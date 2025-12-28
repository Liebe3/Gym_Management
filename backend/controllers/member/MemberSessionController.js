const Member = require("../../models/Member");
const Session = require("../../models/Session");

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

    // Fetch upcoming sessions (scheduled status, future dates)
    const upcomingSessions = await Session.find({
      member: member._id,
      date: { $gte: today },
      status: "scheduled",
    })
      .sort({ date: 1, startTime: 1 })
      .limit(10)
      .populate({
        path: "trainer",
        select: "specializations experience status",
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