const VerifyTrainer = (req, res, next) => {
  const userRole = req.user?.role;
  if (userRole !== "trainer") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};

module.exports = VerifyTrainer;
