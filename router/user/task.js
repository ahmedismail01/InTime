const { createTask } = require('../../controller/user/task')
const { checkAuth } = require('../../utils/checkAuth')

const app = require('express').Router()


app.post("/addUserTask",checkAuth, createTask )


module.exports = app
