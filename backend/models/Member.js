const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      required: true,
    },

    // Changed: Array of trainers instead of single trainer
    trainers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trainer",
      },
    ],

    // Primary trainer (for backward compatibility and quick access)
    primaryTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: false,
    },

    status: {
      type: String,
      enum: ["active", "expired", "none", "pending"],
      default: "none",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
memberSchema.index({ user: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ endDate: 1 });
memberSchema.index({ membershipPlan: 1 });
memberSchema.index({ trainers: 1 });
memberSchema.index({ primaryTrainer: 1 });

// Virtual to get active trainers
memberSchema.virtual("activeTrainers").get(function () {
  // This will be populated with actual trainer data
  return this.trainers || [];
});

module.exports = mongoose.model("Member", memberSchema);