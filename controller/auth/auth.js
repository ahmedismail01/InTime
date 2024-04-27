const {
  comparePassword,
  create,
  update,
  isExists,
} = require("../../modules/user/repo");
const sendEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const { createOtp, verifyOtp } = require("../../modules/otp/repo");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} = require("../../helpers/jwtHelper");
const {
  createRefreshToken,
  verifyRefreshToken,
  updateSession,
  endSession,
  list,
  listSessions,
} = require("../../modules/refreshToken/repo");

const signUp = async (req, res) => {
  const form = req.body;
  const user = await create(form);
  if (!user.success) {
    res.json(user);
    return;
  }
  const token = await createOtp(form.email);
  sendEmail(user.record.email, "activate your account", token.otp, 20);
  res.json({
    message: "check your mail to activate your account",
  });
};

const logIn = async (req, res) => {
  const form = req.body;
  const { success, record, message } = await comparePassword(
    form.email,
    form.password
  );
  if (!success) {
    res.status(401).json({ success, message });
    return;
  }
  if (!record.isActive) {
    res.status(403).json({
      success: false,
      message: "you have to activate your account first",
    });
    return;
  }
  const accessToken = signAccessToken(record._id);
  const refreshToken = signRefreshToken(record._id);
  await createRefreshToken(refreshToken);
  res.json({
    success,
    email: record.email,
    accessToken,
    refreshToken,
  });
};

const activation = async (req, res) => {
  const email = req.body.email;
  const { code } = req.params;
  const isOtpValid = await verifyOtp(email, code);
  if (!isOtpValid.success) {
    res.json({ success: false, message: isOtpValid.message });
    return;
  }
  const response = await update({ email: email }, { isActive: true });
  res.json({
    success: response.success,
    message: "this account is now active",
  });
};

const resetPassword = async (req, res) => {
  const response = await isExists({ email: req.body.email });
  if (!response.success) {
    res.json({ success: false, message: "user not registered" });
    return;
  }
  if (response.record.isActive == false) {
    res.json({
      success: false,
      message: "you have to activate the account first",
    });
    return;
  }
  const otpObject = await createOtp(req.body.email);
  sendEmail(response.record.email, "reset password", otpObject.otp, 20);
  res.json({ success: true });
};

const changePassword = async (req, res) => {
  const { otp } = req.params;
  const { password, email } = req.body;
  const validOtp = await verifyOtp(email, otp);
  if (!validOtp.success) {
    res.json({ success: false, message: validOtp.message });
    return;
  }
  const isMatched = await comparePassword(email, password);
  if (isMatched.success) {
    res
      .status(404)
      .json({ success: false, message: "password must be unique" });
    return;
  }
  await update({ email: email }, { password: await bcrypt.hash(password, 5) });
  res.json({ success: true, message: "password changed" });
};

const resendActivationCode = async (req, res) => {
  const { email, password } = req.body;
  const user = await comparePassword(email, password);
  if (!user.success) {
    res.json({ success: false, message: user.message });
    return;
  }
  if (user.record.isActive) {
    res.json({ success: false, message: "user already activated" });
    return;
  }
  const token = await createOtp(email);
  sendEmail(user.record.email, "activate your account", token.otp, 20);
  await update({ _id: user.record._id });
  res.json({ success: true, message: "code sent" });
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.json({ success: false, message: "invalid request" });
  }
  const { success, message, record } = await verifyRefreshToken(refreshToken);
  if (!success) {
    res.json({ success, message });
    return;
  }
  const newAccessToken = await signAccessToken(record.userId);
  const newRefreshToken = await signRefreshToken(record.userId);
  const updated = await updateSession(refreshToken, newRefreshToken);
  updated.success
    ? res.json({ success: false, newAccessToken, newRefreshToken })
    : res.json({ success: false });
};
const signOut = async (req, res) => {
  const { refreshToken } = req.body;
  const response = await endSession(refreshToken);
  res.json(response);
};

const sessions = async (req, res) => {
  const { user } = req.user;
  const userSessions = await listSessions({ userId: user.id });
  res.json(userSessions);
};
module.exports = {
  signUp,
  logIn,
  activation,
  resetPassword,
  changePassword,
  resendActivationCode,
  refreshAccessToken,
  signOut,
  sessions,
};
