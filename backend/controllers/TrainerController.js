const Trainer = require("../models/Trainer");
const User = require("../models/User");
const { getAll } = require("./BaseController");

(exports.getAllTrainer = async (req, res) => {
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
          message: "Specializations must be a non-empty array",
        });
      }

      // Validate experience
      if (experience && (typeof experience !== "number" || experience < 0)) {
        return res.status(400).json({
          success: false,
          message: "Experience must be a non-negative number",
        });
      }

      // Validate work schedule structure if provided
      if (workSchedule && typeof workSchedule !== "object") {
        return res.status(400).json({
          success: false,
          message: "Work schedule must be an object",
        });
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

// Get trainer by ID
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
