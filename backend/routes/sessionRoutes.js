const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const {
  getAllSessions,
  getSessionById,
  getTrainerSessions,
  getMemberSessions,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/SessionController");

router.use(VerifyToken);
router.use(VerifyAdmin);

// General session routes
router.get("/", getAllSessions);
router.get("/:id", getSessionById);
router.post("/", createSession);
router.put("/:id", updateSession);
router.patch("/:id", updateSession);
router.delete("/:id", deleteSession);

// Trainer-specific sessions
router.get("/trainer/:trainerId", getTrainerSessions);

// Member-specific sessions
router.get("/member/:memberId", getMemberSessions);

module.exports = router;
