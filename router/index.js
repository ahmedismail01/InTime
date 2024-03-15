const app = require("express").Router()
const routes = require('./user/index')

app.use("/api/v1",routes)

module.exports = app