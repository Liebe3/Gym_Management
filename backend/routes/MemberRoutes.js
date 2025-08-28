const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const {
  createMember,
  getAllMember,
  checkUserActiveMemberShip,
  updateMember,
  deleteMember,
} = require("../controllers/MemberController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.get("/", getAllMember);
router.post("/", createMember);
router.put("/:id", updateMember); // Add this route
router.patch("/:id", updateMember); // Support both PUT and PATCH
router.get("/check-active/:userId", checkUserActiveMemberShip);
router.delete("/:id", deleteMember);
module.exports = router;
