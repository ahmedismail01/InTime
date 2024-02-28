const app = require("express").Router()
const userRoute = require('./user/index')

app.use("/api/v1",userRoute)

module.exports = app