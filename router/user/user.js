const app = require('express').Router()
const { getUser, getUserTasks} = require('../../controller/user/user')
const { checkAuth } = require('../../utils/checkAuth')

app.get("/" ,checkAuth , getUser)
app.get("/myTasks" , checkAuth , getUserTasks)

module.exports = app