const repo = require("./../../modules/task/repo");

const createTask = async (req, res) => {
  const user = req.user;
  const form = req.body;
  form.userId = user.id;
  form.createdAt = Date.now()
  const created = await repo.create(form);
  res.json(created);
};

const getUserTasks = async (req, res) => {
  const tasks = await repo.list({ userId: req.user.id });
  console.log(tasks)
  res.json(
    tasks
      ? { success: true, record: tasks }
      : { success: false, message: "you dont have any tasks" }
  );
};

const getTaskById = async (req, res) => {
  const { success, record, message } = await repo.get({
    _id: req.params.id,
    userId: req.user.id,
  });
  res.json(success ? { success, record } : { success, message });
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const form = req.body;
  const { success, record, message } = await repo.update(
    {
      _id: id,
      userId: req.user.id,
    },
    form
  );
  res.json(success ? { success , record } : { success, message });
};

const terminateTask = async (req, res) => {
  const { id } = req.params;
  const { success, record, message } = await repo.remove({
    _id: id,
    userId: req.user.id,
  });
  res.json(success ? { success, record } : { success, message });
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  terminateTask,
};
