const {
  get,
  update,
  remove,
  isExists,
  comparePassword,
} = require("../../modules/user/repo");
const taskRepo = require("../../modules/task/repo");
const refreshTokenRepo = require("../../modules/refreshToken/repo");
const bcrypt = require("bcrypt");
const fs = require("fs");
const getUser = async (req, res) => {
  const { success, record, message } = await get({ _id: req.user.id });
  res.json(
    success
      ? {
          success,
          record: {
            name: record.name,
            email: record.email,
            phone: record.phone,
            avatar: record.avatar,
            points: record.points,
            title: record.title,
            about: record.about,
          },
        }
      : { success, message }
  );
};
const editUser = async (req, res) => {
  const user = req.user.id;
  const { name, age, phone, title, about } = req.body;
  const avatar = req.file?.filename;
  const query = {
    name,
    age,
    phone,
    avatar,
    title,
    about,
  };
  const { success, record, message, status } = await update(
    { _id: user },
    query
  );
  res.status(status).json({
    success,
    message,
  });
};
const deleteUser = async (req, res) => {
  const userId = req.user.id;
  const user = await remove({ _id: userId });
  const tasks = await taskRepo.remove({ userId: userId });
  const refreshToken = await refreshTokenRepo.deleteSessions({
    userId: userId,
  });
  user.success && tasks.success && refreshToken.success
    ? res.status(user.status).json(user)
    : res.status(400).json({
        success: false,
        messages: [user?.message, tasks?.message, refreshToken?.message],
      });
};
const deleteUserPhoto = async (req, res) => {
  const userId = req.user.id;
  const user = await update({ _id: userId }, { avatar: "avatarDefault.jpg" });
  if (user.record.avatar != "avatarDefault.jpg") {
    fs.unlink(`public/uploads/${user.record.avatar}`, (err) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ success: "false", message: "something went wrong" });
      }
    });
    res.status(200).json({ success: "true", message: "deleted" });
  } else {
    res
      .status(400)
      .json({ success: "false", message: "you got no profile photo" });
  }
};
const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const compareOldPassword = await comparePassword(
    { _id: userId },
    oldPassword
  );
  if (!compareOldPassword.success) {
    return res
      .status(compareOldPassword.status)
      .json({ success: false, message: compareOldPassword.message });
  }
  const hashedPassword = bcrypt.hashSync(newPassword, 5);
  const updatePassword = await update(
    { _id: userId },
    { password: hashedPassword }
  );
  const { success, message, error, status } = updatePassword;
  res
    .status(updatePassword.status)
    .json(success ? { success } : { success, error, message });
};
module.exports = {
  getUser,
  editUser,
  deleteUser,
  deleteUserPhoto,
  changePassword,
};
