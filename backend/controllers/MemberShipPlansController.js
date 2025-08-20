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

exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      duration,
      durationType,
      description,
      features,
      status,
    } = req.body;

    if (name) {
      const existingPlan = await Plan.findOne({ name, _id: { $ne: id } }); //$ne not equal query
      if (existingPlan) {
        return res
          .status(400)
          .json({ message: "Plan with this name already exist" });
      }
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      {
        name,
        price,
        duration,
        durationType,
        description,
        features,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    res.status(200).json({
      message: "Membership Plan updated successfully",
      plan: updatedPlan,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validatio failed",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Membership plan not found" });
    }

    res.status(200).json({ mesasge: "Membership plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
