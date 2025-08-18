const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const {
  createPlan,
  getAllPlans,
  updatePlan,
} = require("../controllers/MemberShipPlansController");

router.use(VerifyToken);
router.use(VerifyAdmin)

router.get("/", getAllPlans);
router.post("/", createPlan);
router.put("/:id", updatePlan);

module.exports = router;
