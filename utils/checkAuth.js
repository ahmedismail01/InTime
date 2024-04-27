const jwt = require("jsonwebtoken");
exports.checkAuth = (req, res, next) => {
  if (!req.header("authorization")) {
    res
      .status(403)
      .json({ success: false, message: "you have to send the token" });
    return;
  }
  const token = req.header("authorization").split(" ")[1];

  try {
    const { user } = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
    if (!user) {
      res.status(403).json({ success: false, message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Unauthorized" });
  }
};
