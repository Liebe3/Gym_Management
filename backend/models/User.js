const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      trim: true, // remove extra spaces
    },

    lastName: {
      type: String,
      required: [true, "last name is required"],
      trim: true, // remove extra spaces
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // store emails in lowercase
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },

    role: {
      type: String,
      enum: ["admin", "trainer", "member", "user"],
      default: "user",
    },

    phone: { type: String },
    membershipType: {
      type: String,
      enum: ["Basic", "Standard", "Premium", null],
      default: null,
    },

    joinedDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "Active", "Inactive", "Expired"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
