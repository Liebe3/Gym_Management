const express = require('express');
const router = express.Router();
const VerifyToken = require('../../middleware/VerifyToken');
const VerifyTrainer = require('../../middleware/VerifyTrainer');


router.use(VerifyToken);
router.use(VerifyTrainer);

const {getMySessions, createMySession, updateMySession} = require("../../controllers/SessionController");

router.get('/', getMySessions);
router.post('/', createMySession); 
router.put('/:sessionId', updateMySession);

module.exports = router;