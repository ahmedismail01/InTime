const Task = require("../../modules/task/repo");
const schedule = require("node-schedule");
const moment = require("moment");
const { handleWebPushForTasks } = require("../webPush");

let scheduledTasks = {}; // Track scheduled tasks

const scheduleTask = async (task) => {
  const { endAt, startAt, _id, name } = task;

  // Check if the task is already scheduled
  if (scheduledTasks[_id]) {
    return; // Skip if already scheduled
  }

  if (endAt >= new Date(Date.now())) {
    const taskTime = endAt - startAt;
    const beforeItEnds = moment(startAt)
      .add(taskTime * 0.8, "ms")
      .toDate();

    // Schedule job for task start
    const startJob = schedule.scheduleJob(startAt, () => {
      console.log(`It's time to start task "${name}"`);
      const payload = JSON.stringify({
        title: "Task started.",
        message: `It's time to start task "${name}"`,
      });
      handleWebPushForTasks(task, payload);
    });

    // Schedule job for task nearing deadline
    const beforeEndJob = schedule.scheduleJob(beforeItEnds, () => {
      console.log(`The deadline for "${name}" is coming up soon`);
      const payload = JSON.stringify({
        title: "Upcoming Task Deadline.",
        message: `The deadline for "${name}" is coming up soon`,
      });
      handleWebPushForTasks(task, payload);
    });

    // Schedule job for task end
    const endJob = schedule.scheduleJob(endAt, async () => {
      console.log(`Task: "${name}" time is up, but you can still catch up`);
      const payload = JSON.stringify({
        title: "The deadline for the task has arrived.",
        message: `Task: "${name}" time is up, but you can still catch up`,
      });
      handleWebPushForTasks(task, payload);
      await Task.update({ _id: _id }, { backlog: true });
    });

    // Record scheduled jobs
    scheduledTasks[_id] = { startJob, beforeEndJob, endJob };
  } else {
    await Task.update({ _id: task._id }, { backlog: true });
  }
};

const deleteScheduledTask = (_id) => {
  try {
    const jobs = scheduledTasks[_id];
    if (jobs) {
      jobs.startJob.cancel();
      jobs.beforeEndJob.cancel();
      jobs.endJob.cancel();
      delete scheduledTasks[_id];
    }
  } catch (err) {
    console.error("Error scheduling tasks:", err);
  }
};

const scheduleTasks = async () => {
  try {
    const tasks = await Task.list({ completed: false });
    for (const task of tasks) {
      await scheduleTask(task);
    }
  } catch (error) {
    console.error("Error scheduling tasks:", error);
  }
};

const handleTaskCreation = async (task) => {
  await scheduleTask(task);
};

const handleTaskDeletion = async (_id) => {
  deleteScheduledTask(_id);
};

module.exports = {
  scheduleTasks,
  handleTaskCreation,
  handleTaskDeletion,
};
