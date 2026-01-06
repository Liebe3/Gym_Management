const express = require("express");
const router = express.Router();
const VerifyToken = require("../../middleware/VerifyToken");
const VerifyMember = require("../../middleware/VerifyMember");

const {
  getMemberProfile,
  updateMemberProfile,
  updateMemberPassword
} = require("../../controllers/member/memberProfileController");

router.use(VerifyToken);
router.use(VerifyMember);


router.get("/member/profile", getMemberProfile);
router.put("/member/profile", updateMemberProfile);
router.put("/member/profile/change-password", updateMemberPassword);
module.exports = router;
