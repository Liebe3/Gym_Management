const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");

const { createPlan } = require("../controllers/MemberShipPlansController");

router.use(VerifyToken);

router.post("/", createPlan);

module.exports = router;
