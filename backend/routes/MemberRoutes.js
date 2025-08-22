const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const { createMember } = require("../controllers/MemberController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.post("/", createMember);


module.exports = router;