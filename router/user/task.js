const controller = require("../../controller/user/task");
const { checkAuth } = require("../../utils/checkAuth");
const multer = require("multer");
const app = require("express").Router();
const path = require("path");
const { createTask, updateTask } = require("../../helpers/validation/task");
const validate = require("../../utils/common.validate");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.post(
  "/addUserTask/",
  [checkAuth, upload.single("image")],
  validate(createTask),
  controller.createTask
);
app.get("/searchTasks/:text", checkAuth, controller.search);
app.get("/", checkAuth, controller.getUserTasks);
app.get("/:id", checkAuth, controller.getTaskById);
app.post("/deleteById/:id", checkAuth, controller.terminateTask);
app.post(
  "/updateById/:id",
  [checkAuth, upload.single("image")],
  validate(updateTask),
  controller.updateTask
);
app.post("/completeTask/:taskId", checkAuth, controller.completeTask);

// completeTask
// completeStep

module.exports = app;
