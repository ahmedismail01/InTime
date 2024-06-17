const app = require("express").Router();
const controller = require("../../controller/user/project");
const path = require("path");
const multer = require("multer");
const { checkAuth } = require("../../utils/checkAuth");
const { createTask, updateTask } = require("../../helpers/validation/task");
const validate = require("../../utils/common.validate");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.get("/myProjects", checkAuth, controller.getMyProjects);
app.get("/:id", checkAuth, controller.getProject);
app.post(
  "/createProject",
  [checkAuth, upload.single("image")],
  controller.createProject
);
app.post(
  "/editProject/:projectId",
  [checkAuth, upload.single("image")],
  controller.editProject
);
app.get(
  "/generateInviteLink/:projectId",
  checkAuth,
  controller.generateInviteLink
);
app.get("/joinProject/:projectId/:otp", checkAuth, controller.joinProject);
// app.post("removeMember");
app.post(
  "/assignTask/:projectId/:userId",
  [checkAuth, upload.single("image")],
  validate(createTask),
  controller.assignTask
);
// app.get("getGroupTasks");
// app.post("editGroupTask");

module.exports = app;
