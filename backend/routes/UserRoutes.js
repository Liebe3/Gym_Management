const express = require("express");
const router = express.Router();
const VerifyToken = require("../middleware/VerifyToken");
const VerifyAdmin = require("../middleware/VerifyAdmin");

const { getAllUser, createUser } = require("../controllers/UserController");

router.use(VerifyToken);
router.use(VerifyAdmin);

router.get("/", getAllUser);
router.post("/", createUser)

module.exports = router;
