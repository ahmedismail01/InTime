const Task = require("../../modules/task/repo");
const schedule = require("node-schedule");
const moment = require("moment");
const { handleWebPushForTasks } = require("../webPush");

const { getUser } = require("../../controller/user/user");
module.exports = scheduleTasks = async () => {
  const tasks = await Task.list({ completed: false });
  for (let i in tasks) {
    if (tasks[i].endAt >= new Date(Date.now())) {
      const { endAt, startAt } = tasks[i];
      const taskTime = endAt - startAt;
      const beforeItEnds = moment(startAt)
        .add(taskTime * 0.8, "ms")
        .toDate();
      schedule.scheduleJob(startAt, () => {
        console.log(`its time to start task "${tasks[i].name}"`);

        const payload = JSON.stringify({
          title: "Task started.",
          message: `its time to start task "${tasks[i].name}"`,
        });
        handleWebPushForTasks(tasks[i], payload);
      });
      schedule.scheduleJob(beforeItEnds, () => {
        console.log(`The Deadline for "${tasks[i].name}" is coming up soon`);
        const payload = JSON.stringify({
          title: "Upcoming Task Deadline.",
          message: `The Deadline for "${tasks[i].name}" is coming up soon`,
        });
        handleWebPushForTasks(tasks[i], payload);
      });
      schedule.scheduleJob(endAt, async () => {
        console.log(
          `task : "${tasks[i].name}" time is up but you can still catch up`
        );
        const payload = JSON.stringify({
          title: "The deadline for the task has arrived.",
          message: `task : "${tasks[i].name}" time is up but you can still catch up`,
        });
        handleWebPushForTasks(tasks[i], payload);
        await Task.update({ _id: tasks[i].name }, { backlog: true });
      });
    } else {
      await Task.update({ _id: tasks[i]._id }, { backlog: true });
    }
  }
};
