const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const authRoutes = require("../routes/AuthRoutes");
const userRoutes = require("../routes/UserRoutes");
const membershipPlansRoutes = require("../routes/MemberShipPlansRoutes");
const memberRoutes = require("../routes/MemberRoutes");
const trainerRoutes = require("../routes/TrainerRoutes");
const sessionRoutes = require("../routes/SessionRoutes");

// Trainer Panel Routes
const trainerProfileRoutes = require("../routes/trainer/TrainerProfileRoutes");
const trainerClientsRoutes = require("../routes/trainer/TrainerClientsRoutes");
const trainerSessionRoutes = require("../routes/trainer/TrainerSessionRoutes");
const trainerDashboardRoutes = require("../routes/trainer/TrainerDashboardRoutes");

// MemberPanel Routes
const memberHomeRoutes = require("../routes/member/memberHomeRoutes");
const memberSessionRoutes = require("../routes/member/memberSessionRoutes");

const {
  startMembershipScheduler,
} = require("../scheduler/membershipScheduler");

dotenv.config();

// Connect to database and start scheduler
connectDB()
  .then(() => {
    // Start the membership expiration scheduler
    startMembershipScheduler();
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const app = express();

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://JPGym_management"],
    credentials: true,
  })
);

app.use(express.json());

// Admin Panel Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/membership-plans", membershipPlansRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/session", sessionRoutes);

// Trainer Panel Routes
app.use("/api/trainer-panel", trainerProfileRoutes);
app.use("/api/trainer-panel", trainerClientsRoutes);
app.use("/api/trainer-panel/sessions", trainerSessionRoutes);
app.use("/api/trainer-panel/dashboard", trainerDashboardRoutes);

// Member Panel Routes
app.use("/api/member-panel", memberHomeRoutes);
app.use("/api/member-panel/sessions", memberSessionRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Gym management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
