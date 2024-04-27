const { get, update, remove, isExists } = require("../../modules/user/repo");
const taskRepo = require("../../modules/task/repo");
const refreshTokenRepo = require("../../modules/refreshToken/repo");

const getUser = async (req, res) => {
  const { success, record, message } = await get({ _id: req.user.id });
  res.json(success ? { success, record } : { success, message });
};
const editUser = async (req, res) => {
  const user = req.user.id;
  const { name, age, phone } = req.body;
  const avatar = req.file?.filename;
  const query = {
    name,
    age,
    phone,
    avatar,
  };
  const { success, record, message } = await update({ _id: user }, query);
  res.json({
    success,
    record: {
      name: record.name,
      email: record.email,
      phone: record.phone,
      avatar: record.avatar,
    },
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
    ? res.json(user)
    : res.json({
        success: false,
        messages: [user.message, tasks.message, refreshToken.message],
      });
};

module.exports = {
  getUser,
  editUser,
  deleteUser,
};
