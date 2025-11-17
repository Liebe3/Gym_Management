const express = require('express');
const router = express.Router();
const VerifyToken = require('../../middleware/VerifyToken');
const VerifyTrainer = require('../../middleware/VerifyTrainer');


router.use(VerifyToken);
router.use(VerifyTrainer);

const {getMySessions, getMySessionById, createMySession, updateMySession} = require("../../controllers/trainer/TrainerSessionController");

router.get('/', getMySessions);
router.get('/:sessionId', getMySessionById);
router.post('/', createMySession); 
router.put('/:sessionId', updateMySession);

module.exports = router;