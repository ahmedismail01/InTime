const controller = require('../../controller/user/task')
const {checkAuth} = require('../../utils/checkAuth')

const app = require('express').Router()


app.post("/addUserTask/",checkAuth,controller.createTask )
app.get("/:page/:size",checkAuth, controller.getUserTasksPaginated)
app.get("/",checkAuth, controller.getUserTasks)
app.get("/:id",checkAuth, controller.getTaskById)
app.post("/deleteById/:id",checkAuth, controller.terminateTask)
app.post("/updateById/:id",checkAuth, controller.updateTask)

// completeTask // node-schadular
// completeStep


module.exports = app