const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

router.use(VerifyToken);
router.use(VerifyAdmin);

const { getAdminDashboard } = require("../controllers/DashboardController");

router.get("/admin", getAdminDashboard);

module.exports = router;
