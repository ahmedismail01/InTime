const Task = require("../../modules/task/repo");
const schedule = require("node-schedule");
const moment = require("moment");

const { getUser } = require("../../controller/user/user");
module.exports = scheduleTasks = async () => {
  const tasks = await Task.list();
  for (let i in tasks) {
    if (tasks[i].endAt >= new Date(Date.now())) {
      const { endAt, startAt } = tasks[i];
      const taskTime = endAt - startAt;
      const beforeItEnds = moment(startAt)
        .add(taskTime * 0.8, "ms")
        .toDate();
      schedule.scheduleJob(startAt, () => {
        console.log(`its time to start task "${tasks[i].name}"`);
        io.to();
      });
      schedule.scheduleJob(beforeItEnds, () => {
        console.log(`The Deadline for "${tasks[i].name}" is coming up soon`);
      });
      schedule.scheduleJob(endAt, () => {
        console.log(
          `task : "${tasks[i].name}" time is up but you can still catch up`
        );
      });
    } else {
      schedule.scheduleJob;
    }
  }
};
