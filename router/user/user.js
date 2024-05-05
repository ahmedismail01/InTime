const app = require("express").Router();
const { getUser, editUser, deleteUser } = require("../../controller/user/user");
const { changePassword } = require("../../controller/auth/auth");
const { checkAuth } = require("../../utils/checkAuth");
const multer = require("multer");
const path = require("path");
const validate = require("../../utils/common.validate");
const { updateUser } = require("../../helpers/validation/user");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.get("/", checkAuth, getUser);
app.post(
  "/editProfile",
  [checkAuth, validate(updateUser), upload.single("avatar")],
  editUser
);
app.delete("/deleteUser", checkAuth, deleteUser);
app.post("/changePassword", checkAuth);

//addPoints
//validate updateUser
//deleteTasks when deleteUser

module.exports = app;
