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
app.delete(
  "/removeMember/:projectId/:userId",
  checkAuth,
  controller.removeMember
);
app.post(
  "/assignTask/:projectId/:userId",
  [checkAuth, upload.single("image")],
  validate(createTask),
  controller.assignTask
);
app.get("/getProjectTasks/:projectId", checkAuth, controller.getProjectTasks);
app.get("/projectMembers/:projectId", checkAuth, controller.getMemebers);
app.post(
  "/editProjectTask/:projectId/:taskId",
  [checkAuth, upload.single("image")],
  validate(updateTask),
  controller.editProjectTask
);
app.delete("/removeProject/:projectId", checkAuth, controller.removeProject);
app.delete(
  "/deleteProjectTask/:projectId/:taskId",
  checkAuth,
  controller.removeProjectTask
);
app.delete(
  "/removeProjectImage/:projectId",
  checkAuth,
  controller.removeProjectPhoto
);

module.exports = app;
