const VerifyAdmin = (req, res, next) => {
  const userRole = req.user?.role;
  if (userRole !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = VerifyAdmin;
