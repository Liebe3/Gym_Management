const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyTrainer = require("../../middleware/VerifyTrainer");

router.use(VerifyToken);
router.use(VerifyTrainer);

const {
  getMySessions,
  getMySessionById,
  createMySession,
  updateMySession,
  cancelMySession,
} = require("../../controllers/trainer/TrainerSessionController");

router.get("/", getMySessions);
router.get("/:sessionId", getMySessionById);
router.post("/", createMySession);
router.put("/:sessionId", updateMySession);
router.put("/:sessionId/cancel", cancelMySession);

module.exports = router;
