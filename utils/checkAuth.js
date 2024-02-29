const jwt = require('jsonwebtoken')
exports.checkAuth = (req,res,next) => {
  const token = req.header("authorization").split(' ')[1]
  try{
    const user = jwt.verify(token,process.env.JWT_PRIVATE_KEY)
    req.user=user
    next()
  }catch(err){
    console.log(err)
    res.json({success : false , message :" invaled token"})
  }
}