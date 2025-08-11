const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const authRoutes = require("../routes/AuthRoutes");

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

//test Route
app.get("/", (req, res) => {
  res.send("Gym management API Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server in running in Port${PORT}`));
