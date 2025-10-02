const mongoose = require("mongoose");
const trainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active",
    },

    specializations: [
      { type: String, trim: true, minlength: 2, maxlength: 50 },
    ],

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    workSchedule: {
      monday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
        endTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
      },
      tuesday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
        endTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
      },
      wednesday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
        endTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
      },
      thursday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
        endTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
      },
      friday: {
        isWorking: { type: Boolean, default: true },
        startTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
        endTime: { type: String, match: /^([0-1]\d|2[0-3]):([0-5]\d)$/ },
      },
      saturday: {
        isWorking: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
      },
      sunday: {
        isWorking: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
      },
    },

    isAvailableForNewClients: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

trainerSchema.index({ user: 1 });
trainerSchema.index({ specializations: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ workSchedule: 1 });

// Virtual for calculating availability status
trainerSchema.virtual("availabilityStatus").get(function () {
  if (this.status !== "active") return "unavailable";
  return this.isAvailableForNewClients ? "available" : "busy";
});

module.exports = mongoose.model("Trainer", trainerSchema);
