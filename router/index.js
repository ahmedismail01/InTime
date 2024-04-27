const app = require("express").Router();
const userRoutes = require("./user/index");
const authRoutes = require("./auth");
const imageRoutes = require("./images");
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/images", imageRoutes);

app.all("*", (req, res, next) => {
  res.status(404).json({ success: false, message: "cant find this page" });
});

module.exports = app;
