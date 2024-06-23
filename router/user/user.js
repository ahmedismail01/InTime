const app = require("express").Router();
const {
  getUser,
  editUser,
  deleteUser,
  deleteUserPhoto,
  changePassword,
  getUsersRank,
  addWebSub,
  getNotifications,
} = require("../../controller/user/user");
const { checkAuth } = require("../../utils/checkAuth");
const multer = require("multer");
const path = require("path");
const validate = require("../../utils/common.validate");
const { updateUser, newPassword } = require("../../helpers/validation/user");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.get("/", checkAuth, getUser);
app.get("/getUsersRank", checkAuth, getUsersRank);
app.post(
  "/editProfile",
  [upload.single("avatar"), validate(updateUser), checkAuth],
  editUser
);
app.delete("/deleteUser", checkAuth, deleteUser);
app.delete("/deleteProfilePhoto", checkAuth, deleteUserPhoto);
app.post("/changePassword", [checkAuth, validate(newPassword)], changePassword);
app.post("/subscribe", checkAuth, addWebSub);

module.exports = app;
