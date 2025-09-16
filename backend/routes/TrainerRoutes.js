const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const { createTrainer, getAllTrainer} = require("../controllers/TrainerController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.get("/", getAllTrainer)
router.post("/", createTrainer);

module.exports = router;