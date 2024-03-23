const app = require('express').Router()
const { getUser} = require('../../controller/user/user')
const { checkAuth } = require('../../utils/checkAuth')

app.get("/" ,checkAuth , getUser)


//points
//updateprofile
//addPoints



module.exports = app