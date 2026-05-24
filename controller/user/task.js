const paginationResponse = require("../../utils/paginate");
const repo = require("./../../modules/task/repo");
const {
  handleTaskCreation,
  handleTaskDeletion,
} = require("../../helpers/scheduler/tasks");
const userRepo = require("../../modules/user/repo");
const userModel = require("../../modules/user/model");
const moment = require("moment-timezone");
const { default: mongoose } = require("mongoose");

const createTask = async (req, res) => {
  const userId = req.user.id;
  const form = req.body;
  form.image = req.file?.filename;
  form.userId = userId;
  const cairoTime = moment.tz("Africa/Cairo");
  form.createdAt = cairoTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ");
  const created = await repo.create(form);
  if (created.success) {
    await userModel.updateOne(
      { _id: userId },
      { $inc: { "tasks.onGoingTasks": 1 } },
    );
  }
  if (created.success) {
    handleTaskCreation(created.record);
  }

  res.status(created.status).json(created);
};
const getUserTasks = async (req, res) => {
  req.query.userId = new mongoose.Types.ObjectId(req.user.id);
  const { page = 1, size = 10, sortBy, sortingType, ...query } = req?.query;

  const {
    tasks = [],
    total: totalTasksCount,
    tags: userTags = [],
  } = await repo.listPaginated(
    query,
    sortBy,
    sortingType,
    Number(page),
    Number(size),
  );

  const paginated = paginationResponse(
    Number(size),
    Number(page),
    tasks,
    totalTasksCount,
  );

  res.json({
    success: true,
    record: tasks,
    tags: userTags,
    previousPage: paginated.previousPage,
    nextPage: paginated.nextPage,
  });
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
  const image = req?.file?.filename;
  form.image = image;
  const { success, record, message, status } = await repo.update(
    {
      _id: id,
      userId: req.user.id,
    },
    form,
  );
  if (success) {
    handleTaskDeletion(id);
    handleTaskCreation(record);
  }

  res.status(status).json(success ? { success, record } : { success, message });
};
const terminateTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const exists = await repo.isExists({ _id: id, userId });
  if (exists.record.projectTask) {
    return res.json({
      success: false,
      message: "user cant delete project Task",
    });
  }
  const { success, record, message, status } = await repo.remove({
    _id: id,
    userId: userId,
  });
  if (success) {
    handleTaskDeletion(record._id);
    if (record.completed == true) {
      const user = await userModel.updateOne(
        { _id: userId },
        { $inc: { "tasks.completedTasks": -1 } },
      );
    } else {
      const user = await userModel.updateOne(
        { _id: userId },
        { $inc: { "tasks.onGoingTasks": -1 } },
      );
    }
  }
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
    { completed: true },
  );
  handleTaskDeletion(taskId);
  await userModel.updateOne(
    { _id: userId },
    { $inc: { "tasks.onGoingTasks": -1, "tasks.completedTasks": 1 } },
  );
  if (!task.success) {
    return res.status(updated.status).json(updated);
  }
  const user = await userRepo.addPoints({ _id: userId }, 10);

  res.status(user.status).json(user);
};
const search = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, size = 10 } = req?.query;
  const text = req.params.text;
  const tasks = await repo.search(userId, text);

  const paginated = paginationResponse(Number(size), Number(page), tasks);

  res.json({
    success: true,
    record: tasks,
    previousPage: paginated.previousPage,
    nextPage: paginated.nextPage,
  });
};
const removeTaskPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const task = await repo.update({ _id: taskId, userId }, { image: "" });
    res.status(task.status).json(task);
  } catch (err) {
    return res.status(500).json({ success: "false", message: err.message });
  }
};
module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  terminateTask,
  completeTask,
  search,
  removeTaskPhoto,
};
