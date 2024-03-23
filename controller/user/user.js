const {get,update,remove,isExists} = require('../../modules/user/repo')
const taskRepo = require('../../modules/task/repo')


const getUser = async (req,res) => {
  const {success , record , message} = await get({_id : req.user.id})
  record.password = undefined
  res.json(success? {success ,record} : { success ,message})
}



module.exports = {
  getUser,
 
}