const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyMember = require("../../middleware/VerifyMember");

const {
  getUpcomingSessions,
  bookSession,
  getAssignedTrainers,
} = require("../../controllers/member/MemberSessionController");

router.use(VerifyToken);
router.use(VerifyMember);

router.get("/upcoming-sessions", getUpcomingSessions);
router.get("/assigned-trainers", getAssignedTrainers);

router.post("/book-session", bookSession);

module.exports = router;
