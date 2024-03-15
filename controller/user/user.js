const {get,update,remove,isExists} = require('../../modules/user/repo')


const getUser = async (req,res) => {
  var {name , email ,points , age} = await get({_id : req.user.id})

  res.json({name , email ,points,age})
}

const getUserTask = (req,res)=> {
  
}


module.exports = {
  getUser
}