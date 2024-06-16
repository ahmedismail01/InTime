const paginate = require("../../utils/paginate");
const repo = require("./../../modules/task/repo");
const scheduleTasks = require("../../helpers/scheduler/tasks");
const userRepo = require("../../modules/user/repo");
const userModel = require("../../modules/user/model");

const getTags = (tasks) => {
  const userTags = [];
  for (i in tasks) {
    if (tasks[i].tag.name) {
      userTags.push(tasks[i].tag);
    }
  }
  return userTags;
};

const createTask = async (req, res) => {
  const userId = req.user.id;
  const form = req.body;
  form.image = req.file?.filename;
  form.userId = userId;

  const created = await repo.create(form);
  if (created.success) {
    await userModel.updateOne(
      { _id: userId },
      { $inc: { "tasks.onGoingTasks": 1 } }
    );
  }
  scheduleTasks();
  res.status(created.status).json(created);
};
const getUserTasks = async (req, res) => {
  req.query.userId = req.user.id;
  const { page, size, sortBy, sortingType } = req?.query;
  delete req.query.page;
  delete req.query.size;
  delete req.query.sortBy;
  delete req.query.sortingType;

  const tasks = await repo.list(req.query, sortBy, sortingType);
  const userTags = getTags(tasks);
  if (tasks) {
    if (page && size) {
      const paginated = paginate(Number(size), Number(page), tasks);
      res.json({
        success: true,
        record: paginated.paginatedItems,
        tags: userTags,
        previousPage: paginated.previousPage,
        nextPage: paginated.nextPage,
      });
    } else {
      res.status(200).json({ success: true, record: tasks, tags: userTags });
    }
  } else {
    res
      .status(200)
      .json({ success: false, message: "you dont have any tasks" });
  }
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
  const { success, record, message, status } = await repo.update(
    {
      _id: id,
      userId: req.user.id,
    },
    form
  );
  scheduleTasks();

  res.status(status).json(success ? { success, record } : { success, message });
};
const terminateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { success, record, message, status } = await repo.remove({
    _id: id,
    userId: userId,
  });
  if (success) {
    if (record.completed == true) {
      const user = await userModel.updateOne(
        { _id: userId },
        { $inc: { "tasks.completedTasks": -1 } }
      );
    } else {
      const user = await userModel.updateOne(
        { _id: userId },
        { $inc: { "tasks.onGoingTasks": -1 } }
      );
    }
  }
  scheduleTasks();
  res.status(status).json(success ? { success, record } : { success, message });
};

const completeTask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.taskId;
  const task = await repo.get({ _id: taskId, userId: userId });
  if (!task.success) {
    return res.status(task.status).json(task);
  }
  if (task.record.completed) {
    return res
      .status(403)
      .json({ success: false, message: "task is already completed" });
  }
  const updated = await repo.update(
    { _id: taskId, userId: userId },
    { completed: true }
  );
  await userModel.updateOne(
    { _id: userId },
    { $inc: { "tasks.onGoingTasks": -1, "tasks.completedTasks": 1 } }
  );
  if (!task.success) {
    return res.status(updated.status).json(updated);
  }
  const user = await userRepo.addPoints({ _id: userId }, 10);

  res.status(user.status).json(user);
};
const search = async (req, res) => {
  const userId = req.user.id;
  const text = req.params.text;
  const tasks = await repo.search(userId, text);
  res.json(tasks);
};
module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  terminateTask,
  completeTask,
  search,
};
