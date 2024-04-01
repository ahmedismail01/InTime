const Task = require('../../modules/task/repo')
const schedule = require('node-schedule');

module.exports = scheduleTasks = async ()=> {
  const tasks = await Task.list()
  for(let i in tasks){
    schedule.scheduleJob(tasks[i].startAt , ()=> {
      console.log( "task : " + tasks[i].name + " started")
    })
    schedule.scheduleJob(tasks[i].endAt  , ()=> {
      console.log( "task : " + tasks[i].name + " ended")
    })
  }
}



