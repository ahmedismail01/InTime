const app = require('express').Router()
const routes = require('../../controller/auth/auth')

app.post('/signup' ,routes.signUp)
app.post('/login' ,routes.logIn)


module.exports = app