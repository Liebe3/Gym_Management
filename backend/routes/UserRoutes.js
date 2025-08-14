const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getMemberById,
} = require("../controllers/UsersController");

router.use(VerifyToken); // All routes require login

router.get("/", getMembers);           // Admin only
router.get("/:id", getMemberById);     // Admin or member themselves
router.post("/", createMember);        // Admin only
router.put("/:id", updateMember);      // Admin or member themselves
router.delete("/:id", deleteMember);   // Admin only

module.exports = router;
