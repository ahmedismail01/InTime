const app = require("express").Router();
const { getUser, editUser, deleteUser } = require("../../controller/user/user");
const { checkAuth } = require("../../utils/checkAuth");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
app.get("/", checkAuth, getUser);
app.post("/editProfile", [checkAuth, upload.single("avatar")], editUser);
app.delete("/deleteUser", checkAuth, deleteUser);
//addPoints

module.exports = app;
