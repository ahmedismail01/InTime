const app = require('express').Router()
const userRoutes = require('./user')
const taskRoutes = require('./task')


app.use("/",userRoutes)
app.use("/tasks",taskRoutes)



module.exports = app