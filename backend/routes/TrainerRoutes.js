const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const {
  createTrainer,
  getAllTrainer,
  updateTrainer,
  getTrainerById,
  deleteTrainer,
} = require("../controllers/TrainerController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.get("/", getAllTrainer);
router.get("/:id", getTrainerById);
router.post("/", createTrainer);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer)

module.exports = router;
