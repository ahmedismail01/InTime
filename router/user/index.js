const app = require('express').Router()
const userRoutes = require('./user')
const authRoutes = require('./auth')


app.use("/user",userRoutes)
app.use("/auth",authRoutes)


module.exports = app