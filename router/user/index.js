const app = require('express').Router()
const userRoutes = require('./user')
const authRoutes = require('./auth')
const taskRoutes = require('./task')


app.use("/user",userRoutes)
app.use("/auth",authRoutes)
app.use("/task",taskRoutes)



module.exports = app