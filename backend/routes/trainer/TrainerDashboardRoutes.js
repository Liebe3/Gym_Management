const express = require('express');
const router = express.Router();
const VerifyToken = require('../../middleware/VerifyToken');
const VerifyTrainer = require('../../middleware/VerifyTrainer');


router.use(VerifyToken);
router.use(VerifyTrainer);


const { getTrainerDashboard} = require("../../controllers/trainer/TrainerDashboardController")

router.get('/', getTrainerDashboard);


module.exports = router;