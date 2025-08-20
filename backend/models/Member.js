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
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
    },

    autoRenew: {
      type: Boolean,
      default: false,
    },

    cancellationReason: {
      type: String,
      trim: true,
    },

    payments: [
      {
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },

        paymentMethod: {
          type: String,
          enum: ["cash", "card", "bank_transfer", "online"],
          required: true,
        },

        transactionId: {
          type: String,
          trim: true,
        },

        status: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          default: "completed",
        },

        description: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties
memberSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

memberSchema.virtual("daysRemaining").get(function () {
  const today = new Date();
  if (this.endDate < today) return 0;
  return Math.ceil((this.endDate - today) / (1000 * 60 * 60 * 24));
});

memberSchema.virtual("totalAmountPaid").get(function () {
  return this.payments
    .filter((payment) => payment.status === "completed")
    .reduce((total, payment) => total + payment.amount, 0);
});

// Pre-save middleware to auto-calculate endDate if not provided
memberSchema.pre("save", async function (next) {
  if (this.isNew && !this.isModified("endDate")) {
    try {
      const plan = await mongoose
        .model("MembershipPlan")
        .findById(this.membershipPlan);
      if (plan) {
        const duration = plan.duration;
        const durationType = plan.durationType;

        const endDate = new Date(this.startDate);
        switch (durationType) {
          case "days":
            endDate.setDate(endDate.getDate() + duration);
            break;
          case "weeks":
            endDate.setDate(endDate.getDate() + duration * 7);
            break;
          case "months":
            endDate.setMonth(endDate.getMonth() + duration);
            break;
          case "years":
            endDate.setFullYear(endDate.getFullYear() + duration);
            break;
        }
        this.endDate = endDate;
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Pre-save middleware to auto-update status based on dates
memberSchema.pre("save", function (next) {
  const now = new Date();

  // Auto-expire if end date has passed and status is still active
  if (this.status === "active" && this.endDate < now) {
    this.status = "expired";
  }

  next();
});

// Instance methods
memberSchema.methods.extend = function (additionalDays) {
  const newEndDate = new Date(this.endDate);
  newEndDate.setDate(newEndDate.getDate() + additionalDays);
  this.endDate = newEndDate;

  // Reactivate if it was expired
  if (this.status === "expired") {
    this.status = "active";
  }

  return this.save();
};

memberSchema.methods.cancel = function (reason) {
  this.status = "cancelled";
  this.cancellationReason = reason;
  this.autoRenew = false;
  return this.save();
};

memberSchema.methods.addPayment = function (paymentData) {
  this.payments.push(paymentData);
  return this.save();
};

// Indexes for better performance searching and filtering faster
memberSchema.index({ user: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ endDate: 1 });
memberSchema.index({ membershipPlan: 1 });
memberSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("Member", memberSchema);
