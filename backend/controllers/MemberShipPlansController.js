const Plan = require("../models/MemberShipPlan");

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 }); // fetch plans
    res.status(200).json({ plans }); // send response separately
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    // Convert features string to array if it's a string
    const featuresArray =
      typeof features === "string"
        ? features.split(",").map((feature) => feature.trim())
        : features;

    // Convert status to lowercase
    const normalizedStatus = status?.toLowerCase() || "active";

    const existingPlan = await Plan.findOne({ name });

    if (existingPlan) {
      return res
        .status(400)
        .json({ message: "Plan with this name already exists" });
    }

    const newPlan = new Plan({
      name: name.trim(),
      price,
      duration,
      durationType,
      description: description?.trim(),
      features: featuresArray,
      status: normalizedStatus,
    });

    await newPlan.save();
    res.status(201).json({ message: "Membership plan created successfully" });
  } catch (error) {
    console.error("Plan creation error:", error);
    res.status(500).json({ message: error.message });
  }
};
