const Plan = require("../models/MemberShipPlan");

exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      price,
      duration,
      durationType,
      description,
      features,
      status,
    } = req.body;

    const exisitngPlan = await Plan.findOne({ name });

    if (exisitngPlan) {
      return res
        .status(400)
        .json({ message: "Plan with this name already exist" });
    }

    const newPlan = new Plan({
      name,
      price,
      duration,
      durationType,
      description,
      features,
      status: status || "active",
    });
    await newPlan.save();
    res.status(201).json({ message: "Membership plan created successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
