const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const authRoutes = require("../routes/AuthRoutes");
const membershipPlanRoutes = require("../routes/MemberShipPlansRoute");

dotenv.config();
connectDB();

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", membershipPlanRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Gym management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
