const VerifyMember = (req, res, next) => {
  const userRole = req.user?.role;
  if (userRole !== "member") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  next();
};

module.exports = VerifyMember;
