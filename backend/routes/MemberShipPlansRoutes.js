const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");

const {
  createPlan,
  getAllPlans,
} = require("../controllers/MemberShipPlansController");

router.use(VerifyToken);

router.get("/", getAllPlans);
router.post("/", createPlan);

module.exports = router;
