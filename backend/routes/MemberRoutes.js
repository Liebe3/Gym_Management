const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const { createMember, getAllMember, checkUserActiveMemberShip } = require("../controllers/MemberController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.get("/", getAllMember)
router.post("/", createMember);
router.get("/check-active/:userId", checkUserActiveMemberShip)


module.exports = router; 