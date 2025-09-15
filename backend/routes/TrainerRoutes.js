const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const { createTrainer } = require("../controllers/TrainerController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.post("/", createTrainer);

module.exports = router;