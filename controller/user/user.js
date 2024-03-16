const {get,update,remove,isExists} = require('../../modules/user/repo')
const taskRepo = require('../../modules/task/repo')


const getUser = async (req,res) => {
  const {success , record , message} = await get({_id : req.user.id})
  delete record["password"]

  res.json(success? {success ,record} : { success ,message})
}


const getUserTasks = async (req,res)=> {
  const tasks = await taskRepo.list({userId : req.user.id})
  res.json(tasks[0]? {success : true ,record : tasks} : { success : false  ,message : "you dont have any tasks"})
}

const getTaskById = async (req,res) => {
  const{success , record , message} = await get({_id : req.params.id , userId : req.user.id})
  res.json(success? {success ,record : record.tasks} : { success ,message})
}


module.exports = {
  getUser,
  getUserTasks,
  getTaskById
}