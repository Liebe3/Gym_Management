const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyMember = require("../../middleware/VerifyMember");

const {
  getActiveMemberHomeData,
  getAvailableTrainers,
} = require("../../controllers/member/MemberHomeController");

router.use(VerifyToken);
router.use(VerifyMember);

router.get("/member/home-data", getActiveMemberHomeData);
router.get("/member/available-trainers", getAvailableTrainers);

module.exports = router;
