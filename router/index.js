const app = require("express").Router();
const userRoutes = require("./user/index");
const authRoutes = require("./auth");
const imageRoutes = require("./images");
const { authLimiter } = require("../utils/rateLimiter");
app.use("/user", userRoutes);
app.use("/auth" , authLimiter, authRoutes);
app.use("/images", imageRoutes);

module.exports = app;
