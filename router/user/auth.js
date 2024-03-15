const app = require("express").Router();
const controller = require("../../controller/auth/auth");
const { checkAuth } = require("../../utils/checkAuth");
const { login, register ,resetpassword,onlyEmailWanted } = require("../../helpers/validation/auth");
const validate = require("../../utils/common.validate");


app.post("/signup", validate(register), controller.signUp);
app.post("/login", validate(login) , controller.logIn);
app.post("/activation/:code" ,validate(onlyEmailWanted), controller.activation);
app.post("/resendactivationcode/" ,validate(login), controller.resendActivationCode);
app.post("/forgetpassword/" ,validate(onlyEmailWanted), controller.resetPassword);
app.post("/forgetpassword/changepassword/:otp", validate(resetpassword), controller.changePassword);

module.exports = app;
