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
        specializations,
        experience,
        workSchedule,
        socialMedia,
        isAvailableForNewClients,
        profileImage,
      } = req.body;

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

      const newTrainer = new Trainer({
        user: userId,
        gender,
        specializations,
        experience,
        workSchedule,
        socialMedia,
        isAvailableForNewClients,
        profileImage,
        createdBy: req.user?.id, // check who created the trainer
      });

      await newTrainer.save();

      // Populate user data before sending response
      await newTrainer.populate("user", "firstName lastName email phone");
      res.status(201).json({
        success: true,
        message: "Trainer created successfully",
        trainer: newTrainer,
      });
    } catch (error) {
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
