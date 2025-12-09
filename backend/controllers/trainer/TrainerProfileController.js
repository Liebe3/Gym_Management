const Trainer = require("../../models/Trainer");
const { addStatsToTrainers } = require("../../utils/trainerStats");

// Get trainer profile
exports.getTrainerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const trainer = await Trainer.findOne({ user: userId }).populate({
      path: "user",
      select: "firstName lastName email profilePicture",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    const [trainerWithStats] = await addStatsToTrainers([trainer]);

    res.status(200).json({
      success: true,
      data: trainerWithStats,
    });
  } catch (error) {
    console.error("Get trainer profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update trainer profile
exports.updateTrainerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      gender,
      experience,
      specializations,
      workSchedule,
      isAvailableForNewClients,
    } = req.body;

    const existingTrainer = await Trainer.findOne({ user: userId });

    if (!existingTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer profile not found",
      });
    }

    // Validation
    if (
      specializations &&
      (!Array.isArray(specializations) || specializations.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Specializations must be a non-empty array",
      });
    }

    if (experience && (typeof experience !== "number" || experience < 0)) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative number",
      });
    }

    if (workSchedule) {
      if (typeof workSchedule !== "object") {
        return res.status(400).json({
          success: false,
          message: "Work schedule must be an object",
        });
      }

      const workingDays = Object.entries(workSchedule).filter(
        ([_, schedule]) => schedule.isWorking
      );

      if (workingDays.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Work schedule must have at least 1 working day",
        });
      }

      for (const [day, schedule] of workingDays) {
        if (!schedule.startTime || !schedule.endTime) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have both startTime and endTime`,
          });
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (
          !timeRegex.test(schedule.startTime) ||
          !timeRegex.test(schedule.endTime)
        ) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' has invalid time format. Use HH:MM`,
          });
        }

        const [startHour, startMinute] = schedule.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

        if (endHour * 60 + endMinute <= startHour * 60 + startMinute) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have end time later than start time`,
          });
        }
      }
    }

    const updateData = { lastUpdatedBy: userId };

    if (gender) updateData.gender = gender;
    if (specializations) updateData.specializations = specializations;
    if (experience !== undefined) updateData.experience = experience;
    if (workSchedule) updateData.workSchedule = workSchedule;
    if (isAvailableForNewClients !== undefined)
      updateData.isAvailableForNewClients = isAvailableForNewClients;

    const updatedTrainer = await Trainer.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true }
    ).populate("user", "firstName lastName email");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    console.error("Update trainer profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
