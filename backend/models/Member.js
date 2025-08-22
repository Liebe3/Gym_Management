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

    status: {
      type: String,
      enum: ["active", "expired", "none"],
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

// // Virtual to get payments for this member
// memberSchema.virtual("payments", {
//   ref: "Payment",
//   localField: "_id",
//   foreignField: "member",
// });

// // Virtual to get active subscription
// memberSchema.virtual("subscription", {
//   ref: "Subscription",
//   localField: "_id",
//   foreignField: "member",
//   justOne: true,
// });

// // Updated virtual for total amount paid
// memberSchema.virtual("totalAmountPaid").get(function () {
//   // This would need to be populated or calculated via aggregation
//   return 0; // Placeholder - implement with aggregation pipeline
// });

memberSchema.index({ user: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ endDate: 1 });
memberSchema.index({ membershipPlan: 1 });

module.exports = mongoose.model("Member", memberSchema);
