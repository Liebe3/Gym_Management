const Trainer = require("../models/Trainer");
const User = require("../models/User");

exports.createTrainer = async (req, res) => {
  try {
    const {
      userId,
      gender,
      specializations,
      experience,
      workSchedule,
      socialMedia,
      isAvailableForNewClients,
    } = req.body;

    const user = await User.findById(userId);
    const isNotTrainer = !user || user.role !== "trainer";
    if (isNotTrainer) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID" });
    }

    const newTrainer = new Trainer({
      user: userId,
      gender,
      specializations,
      experience,
      workSchedule,
      socialMedia,
      isAvailableForNewClients,
      createdBy: req.user?.id, // check who created the trainer
    });

    await newTrainer.save();
    res.status(201).json({
      success: true,
      message: "Trainer created successfully",
      trainer: newTrainer,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
