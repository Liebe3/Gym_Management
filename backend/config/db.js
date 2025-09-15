const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "gym_management", // ensures it uses the old DB
    });
    console.log("MongoDB Connected:", mongoose.connection.name);
  } catch (error) {
    console.error("Something went wrong", error);
    process.exit(1);
  }
};

module.exports = connectDB;
