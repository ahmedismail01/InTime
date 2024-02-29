const app = require('express').Router()
const routes = require('../../controller/auth/auth')
const {checkAuth} = require('../../utils/checkAuth')
app.post('/signup' ,routes.signUp)
app.post('/login' ,routes.logIn)
app.post('/activation/:otp' ,routes.activation)
app.post('/resetPassword/' ,routes.resetPassword)
app.post('/resetPassword/changePassword',checkAuth ,routes.changePassword)




module.exports = app