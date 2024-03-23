const app = require("express").Router()
const userRoutes = require('./user/index')
const authRoutes = require('./auth')
app.use("/user",userRoutes)
app.use("/auth" , authRoutes)
app.all("*", (req, res, next) => {
  res.json({ success: false, message: "cant find this page", status: 404 });
});
module.exports = app