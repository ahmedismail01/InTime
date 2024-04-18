const jwt = require("jsonwebtoken");
exports.checkAuth = (req, res, next) => {
  const token = req.header("authorization").split(" ")[1];

  if (!token) {
    res.json({ success: false, message: "you have to send the token" });
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
    if (!user) {
      res.json({ success: false, message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.json({ success: false, message: "Unauthorized" });
  }
};
