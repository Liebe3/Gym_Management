const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyMember = require("../../middleware/VerifyMember");

const {
  getMemberMembershipPlan,
} = require("../../controllers/member/MemberMemberShipController");

router.use(VerifyToken);
router.use(VerifyMember);

router.get("/membership-plans", getMemberMembershipPlan);

module.exports = router;
