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

    specializations: [
      {
        type: String,
        enum: [
          "weight_training",
          "cardio",
          "yoga",
          "pilates",
          "crossfit",
          "bodybuilding",
          "powerlifting",
          "functional_training",
          "zumba",
          "martial_arts",
          "swimming",
          "personal_training",
          "group_fitness",
          "nutrition",
          "rehabilitation",
          "sports_specific",
          "other",
        ],
      },
    ],

    experience: {
      type: Number, // years of experience
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "terminated"],
      default: "active",
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

    // Performance & Metrics
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    totalClients: {
      type: Number,
      default: 0,
    },

    activeClients: {
      type: Number,
      default: 0,
    },

    totalSessions: {
      type: Number,
      default: 0,
    },

    // Media & Profile
    profileImage: {
      type: String, // URL to image
    },

    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
      linkedin: String,
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
trainerSchema.index({ totalClients: 1 });
trainerSchema.index({ activeClients: 1 });
trainerSchema.index({ specializations: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ workSchedule: 1 });

module.exports = mongoose.model("Trainer", trainerSchema);
