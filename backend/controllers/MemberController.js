const Member = require("../models/Member");

exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createMember = async (req, res) => {
  try {
    // Log the incoming request
    console.log("Request Body:", req.body);
    console.log("Auth User:", req.user);

    // Validate required fields
    if (!req.body.firstName || !req.body.lastName || !req.body.email) {
      return res.status(400).json({
        message: "Required fields missing",
        required: ["firstName", "lastName", "email"],
      });
    }

    const member = new Member(req.body);
    const savedMember = await member.save();
    console.log("Member created:", savedMember);
    res.status(201).json(savedMember);
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({
      message: error.message,
      details: error.stack,
    });
  }
};

exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
