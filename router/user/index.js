const app = require("express").Router();
const userRoutes = require("./user");
const taskRoutes = require("./task");
const projectRoutes = require("./project");

app.use("/", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/projects", projectRoutes);

module.exports = app;
