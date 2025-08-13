const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const authRoutes = require("../routes/AuthRoutes");
const memberRoutes = require("../routes/MemberRoutes");

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ["http://localhost:5173", "https://JPGym_management"];

//middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not Allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
//test Route
app.get("/", (req, res) => {
  res.send("Gym management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in running in Port${PORT}`));
