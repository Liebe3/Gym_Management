const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
  },

  memberShipType: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    default: "Basic",
  },

  joinedDate: {
    type: Date,
    default: Date.now,
  },

  status: {
    type: String,
    enum: ["Active", "Pending", "Expired"],
    default: "Pending",
  },
	
});

module.exports = mongoose.model("Member", memberSchema);
