const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberById,
} = require("../controllers/MemberController");

router.get("/", VerifyToken, getMembers);
router.get("/:id", VerifyToken, getMemberById);
router.post("/", VerifyToken, createMember);
router.put("/:id", VerifyToken, updateMember);
router.delete("/:id", VerifyToken, deleteMember);

module.exports = router;
