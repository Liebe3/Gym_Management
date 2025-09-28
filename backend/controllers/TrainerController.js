const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { getAll } = require("./BaseController");

(exports.getAllTrainer = async (req, res) => {
  // Check if 'all' parameter is requested
  if (req.query.all === "true" || req.query.all === true) {
    try {
      const filter = {};

      // Apply status filter if provided
      if (req.query.status && req.query.status !== "all") {
        filter.status = req.query.status;
      }

      // Apply availability filter if provided
      if (req.query.availability !== undefined) {
        filter.isAvailableForNewClients =
          req.query.availability === "true" || req.query.availability === true;
      }

      // Handle search if provided
      if (req.query.search) {
        const userIds = await User.find({
          $or: [
            { firstName: { $regex: req.query.search, $options: "i" } },
            { lastName: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }).select("_id");

        filter.$or = [
          {
            specializations: {
              $elemMatch: { $regex: req.query.search, $options: "i" },
            },
          },
          { user: { $in: userIds.map((u) => u._id) } },
        ];
      }

      const trainers = await Trainer.find(filter)
        .populate({ path: "user", select: "firstName lastName email phone" })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: trainers,
        total: trainers.length,
      });
    } catch (error) {
      console.error("Error fetching all trainers:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  
  return getAll(Trainer, req, res, {
    searchableFields: ["specializations"],
    filterableFields: {
      status: "status",

      availability: "isAvailableForNewClients",
    },
    arrayFields: ["specializations"],
    populate: [{ path: "user", select: "firstName lastName email phone" }],
    countableFields: ["status", "isAvailableForNewClients"],
    customSearch: {
      model: User,
      fields: ["firstName", "lastName", "email"],
      key: "user",
    },
    defaultSort: { createdAt: -1 }, // 👈 newest first
  });
}),
  (exports.createTrainer = async (req, res) => {
    try {
      const {
        userId,
        gender,
        status,
        specializations,
        experience,
        workSchedule,
        isAvailableForNewClients,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      const user = await User.findById(userId);
      const isNotTrainer = !user || user.role !== "trainer";
      if (isNotTrainer) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid user ID" });
      }

      // Check if trainer profile already exists
      const existingTrainer = await Trainer.findOne({ user: userId });
      if (existingTrainer) {
        return res.status(400).json({
          success: false,
          message: "Trainer profile already exists for this user",
        });
      }

      // Validate specializations if provided
      if (
        specializations &&
        (!Array.isArray(specializations) || specializations.length === 0)
      ) {
        return res.status(400).json({
          success: false,
          message: "Specializations must be empty",
        });
      }

      // Validate experience
      if (experience && (typeof experience !== "number" || experience < 0)) {
        return res.status(400).json({
          success: false,
          message: "Experience must be a non-negative number",
        });
      }

      // Validate work schedule structure
      if (!workSchedule || typeof workSchedule !== "object") {
        return res.status(400).json({
          success: false,
          message: "Work schedule must be an object",
        });
      }

      // Validate at least 1 working day
      const workingDays = Object.entries(workSchedule).filter(
        ([_, schedule]) => schedule.isWorking
      );

      if (workingDays.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Work schedule must have at least 1 working day",
        });
      }

      // Validate time input for each working day
      for (const [day, schedule] of workingDays) {
        if (!schedule.startTime || !schedule.endTime) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have both startTime and endTime`,
          });
        }

        //validate HH:MM format
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

        // ✅ Validate endTime is after startTime
        const [startHour, startMinute] = schedule.startTime
          .split(":")
          .map(Number);
        const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        if (endTotalMinutes <= startTotalMinutes) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have an end time later than start time`,
          });
        }
      }

      const trainerData = {
        user: userId,
        createdBy: req.user?.id,
        lastUpdatedBy: req.user?.id,
      };

      // Only add fields if they are provided
      if (gender) trainerData.gender = gender;
      if (status) trainerData.status = status;
      if (specializations) trainerData.specializations = specializations;
      if (experience !== undefined) trainerData.experience = experience;
      if (workSchedule) trainerData.workSchedule = workSchedule;
      if (isAvailableForNewClients !== undefined)
        trainerData.isAvailableForNewClients = isAvailableForNewClients;

      const newTrainer = new Trainer(trainerData);
      await newTrainer.save();

      // Populate user data before sending response
      await newTrainer.populate("user", "firstName lastName email");

      res.status(201).json({
        success: true,
        message: "Trainer created successfully",
        trainer: newTrainer,
      });
    } catch (error) {
      // Handle validation errors specifically
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

      res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  });

// Get trainer by ID for veiwling public profile
exports.getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id).populate({
      path: "user",
      select: "firstName lastName email phone",
    });

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: trainer,
    });
  } catch (error) {
    console.error("Get trainer by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      gender,
      experience,
      status,
      specializations,
      workSchedule,
      isAvailableForNewClients,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Trainer id is required",
      });
    }

    const existingTrainer = await Trainer.findById(id);
    if (!existingTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Validate specializations if provided
    const isInvalidSpecializations =
      specializations &&
      (!Array.isArray(specializations) || specializations.length === 0);

    if (isInvalidSpecializations) {
      return res.status(400).json({
        success: false,
        message: "Specializations must be a non-empty array",
      });
    }

    // validate experinece
    const isInvalidExperience =
      experience && (typeof experience !== "number" || experience < 0);
    if (isInvalidExperience) {
      return res.status(400).json({
        success: false,
        message: "Experience must be a non-negative number",
      });
    }

    // Validate work schedule if provided
    if (workSchedule) {
      if (typeof workSchedule !== "object") {
        return res.status(400).json({
          success: false,
          message: "Work schedule must be an object",
        });
      }

      // Validate at least 1 working day
      const workingDays = Object.entries(workSchedule).filter(
        ([_, schedule]) => schedule.isWorking
      );

      if (workingDays.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Work schedule must have atleast 1 working day",
        });
      }

      // Validate time input for each working day
      for (const [day, schedule] of workingDays) {
        if (!schedule.startTime || !schedule.endTime) {
          return req.status(400).json({
            success: false,
            message: `Working day '${day}' must have both startTime and endTime`,
          });
        }

        //validate HH:MM format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const isInvalidTimeFormat =
          !timeRegex.test(schedule.startTime) ||
          !timeRegex.test(schedule.endTime);
        if (isInvalidTimeFormat) {
          return res.status(400).json({
            success: false,
            message: "Working day '${day}' has invalid time format. Use HH:MM",
          });
        }

        // Validate endTime is after startTime
        const [startHour, startMinute] = schedule.startTime
          .split(":")
          .map(Number);

        const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;

        if (endTotalMinutes <= startTotalMinutes) {
          return res.status(400).json({
            success: false,
            message: `Working day '${day}' must have an end time later than start time`,
          });
        }
      }
    }
    // Build update object with only provided fields
    const updateData = {
      lastUpdatedBy: req.user?.id,
    };

    if (gender) updateData.gender = gender;
    if (status) updateData.status = status;
    if (specializations) updateData.specializations = specializations;
    if (experience !== undefined) updateData.experience = experience;
    if (workSchedule) updateData.workSchedule = workSchedule;
    if (isAvailableForNewClients !== undefined)
      updateData.isAvailableForNewClients = isAvailableForNewClients;

    // Update the trainer
    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run mongoose validators
    }).populate("user", "firstName lastName email phone");

    res.status(200).json({
      success: true,
      message: "Trainer updated successfully",
      trainer: updatedTrainer,
    });
  } catch (error) {
    // Handle validation errors specifically
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

    console.error("Update trainer error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTrainer = await Trainer.findByIdAndDelete(id);

    if (!deleteTrainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Trainer Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
