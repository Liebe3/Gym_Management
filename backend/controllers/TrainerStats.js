const Trainer = require("../models/Trainer");
const Member = require("../models/Member");
const Session = require("../models/Session");

exports.getTrainerStats = async (req, res) => {
  try {
    const trainerId = req.params.id;

    const trainer = await Trainer.findById(trainerId).populate("user");

    if (!trainer) {
      return res
        .status(404)
        .json({ success: false, message: "Trainer not found" });
    }

    // use promise all instead of countDocuments
    const [totalClients, activeClients, totalSessions] = await Promise.all([
      Member.countDocuments({ trainer: trainerId }),
      Member.countDocuments({ trainer: trainerId, status: "active" }),
      Session.countDocuments({ trainer: trainerId }),
    ]);

    res.json({
      ...trainer.toObject(),
      totalClients,
      activeClients,
      totalSessions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
