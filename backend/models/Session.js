const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    // Track who booked/created the session
    bookedBy: {
      type: String,
      enum: ["member", "trainer", "admin"],
      default: "admin",
    },

    date: {
      type: Date, 
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // HH:MM format
    },

    endTime: {
      type: String,
      required: true,
      match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, // HH:MM format
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },

    // Track cancellation reason
    cancellationReason: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    // Attendance tracking
    attendanceStatus: {
      type: String,
      enum: ["attended", "no-show", "rescheduled"],
      default: null,
    },
  },
  { timestamps: true }
);

// Add validation to ensure endTime is after startTime
sessionSchema.pre('save', function(next) {
  const [startHour, startMin] = this.startTime.split(':').map(Number);
  const [endHour, endMin] = this.endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  
  if (endMinutes <= startMinutes) {
    next(new Error('End time must be after start time'));
  } else {
    next();
  }
});

// Indexes for better query performance
sessionSchema.index({ trainer: 1, date: 1 });
sessionSchema.index({ member: 1, date: 1 });
sessionSchema.index({ status: 1 });
sessionSchema.index({ date: 1 });
sessionSchema.index({ bookedBy: 1 });

module.exports = mongoose.model("Session", sessionSchema);