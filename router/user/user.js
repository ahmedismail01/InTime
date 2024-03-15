const app = require('express').Router()
const { getUser} = require('../../controller/user/user')
const { checkAuth } = require('../../utils/checkAuth')

app.get("/" ,checkAuth , getUser)

module.exports = app