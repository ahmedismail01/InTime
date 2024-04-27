const controller = require("../../controller/user/task");
const { checkAuth } = require("../../utils/checkAuth");
const multer = require("multer");
const app = require("express").Router();
const path = require("path");
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
  controller.createTask
);
app.get("/", checkAuth, controller.getUserTasks);
app.get("/:id", checkAuth, controller.getTaskById);
app.post("/deleteById/:id", checkAuth, controller.terminateTask);
app.post("/updateById/:id", checkAuth, controller.updateTask);
// completeTask
// completeStep

module.exports = app;
