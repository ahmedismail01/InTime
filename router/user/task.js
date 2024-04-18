const controller = require("../../controller/user/task");
const { checkAuth } = require("../../utils/checkAuth");

const app = require("express").Router();

app.post("/addUserTask/", checkAuth, controller.createTask);
app.get("/", checkAuth, controller.getUserTasks);
app.get("/:id", checkAuth, controller.getTaskById);
app.post("/deleteById/:id", checkAuth, controller.terminateTask);
app.post("/updateById/:id", checkAuth, controller.updateTask);

// completeTask
// completeStep

module.exports = app;
