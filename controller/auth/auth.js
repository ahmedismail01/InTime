const {
  comparePassword,
  create,
  update,
  isExists,
} = require("../../modules/user/repo");
const sendEmail = require("../../utils/sendMail");
const bcrypt = require("bcrypt");
const { createOtp, verifyOtp, removeOtp } = require("../../modules/otp/repo");
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
  listSessions,
} = require("../../modules/refreshToken/repo");
const OTPLifeSpan = process.env.OTP_LIFESPAN;

const signUp = async (req, res) => {
  const form = req.body;
  const user = await create(form);
  if (!user.success) {
    res.status(user.status).json({
      success: user.success,
      message: user.message,
      error: user.error,
    });
    return;
  }
  const token = await createOtp({ email: form.email });
  sendEmail(user.record.email, "activate your account", token.otp, OTPLifeSpan);
  res.status(user.status).json({
    message: "check your mail to activate your account",
  });
};

const logIn = async (req, res) => {
  const form = req.body;
  const { success, record, message, status } = await comparePassword(
    { email: form.email },
    form.password
  );
  if (!success) {
    res.status(status).json({ success, message });
    return;
  }
  if (!record.isActive) {
    res.status(403).json({
      success: false,
      message: "you have to activate your account first",
    });
    return;
  }
  const createdAt = new Date(Date.now());
  const accessToken = signAccessToken(record._id);
  const refreshToken = signRefreshToken(record._id, createdAt);
  await createRefreshToken(refreshToken, createdAt);
  res.status(status).json({
    success,
    email: record.email,
    accessToken,
    refreshToken,
  });
};

const activation = async (req, res) => {
  try {
    const email = req.body.email;
    const { code } = req.params;

    const isOtpValid = await verifyOtp({ email: email }, code);
    if (!isOtpValid.success) {
      return res
        .status(401)
        .json({ success: false, message: isOtpValid.message });
    }

    const response = await update({ email }, { isActive: true });

    res.status(200).json({
      success: response.success,
      message: "This account is now active",
    });
  } catch (error) {
    console.error("Error during activation:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  const response = await isExists({ email: req.body.email });
  if (!response.success) {
    res.status(response.status).json({
      success: false,
      message: "user not registered",
    });
    return;
  }
  if (response.record.isActive == false) {
    return res.status(403).json({
      success: false,
      message: "you have to activate the account first",
    });
  }
  const otpObject = await createOtp({ email: req.body.email });
  sendEmail(
    response.record.email,
    "reset password",
    otpObject.otp,
    OTPLifeSpan
  );
  res.status(response.status).json({ success: true });
};

const changePassword = async (req, res) => {
  const { otp } = req.params;
  const { password, email } = req.body;
  const validOtp = await verifyOtp({ email: email }, otp);
  if (!validOtp.success) {
    return res.status(401).json({ success: false, message: validOtp.message });
  }
  const isMatched = await comparePassword({ email: email }, password);
  if (isMatched.success) {
    return res
      .status(404)
      .json({ success: false, message: "password must be unique" });
  }
  const response = await update(
    { email: email },
    { password: await bcrypt.hash(password, 5) }
  );
  res
    .status(response.status)
    .json({ success: true, message: "password changed" });
};

const resendActivationCode = async (req, res) => {
  const { email } = req.body;
  const user = await isExists({ email: email });
  if (!user.success) {
    return res.json({ success: false, message: user.message });
  }
  if (user.record.isActive) {
    return res.json({ success: false, message: "user already activated" });
  }
  const token = await createOtp({ email: email });
  sendEmail(user.record.email, "activate your account", token.otp, OTPLifeSpan);
  await update({ _id: user.record._id });
  res.json({ success: true, message: "code sent" });
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.json({ success: false, message: "invalid request" });
  }
  const { success, message, record, error } = await verifyRefreshToken(
    refreshToken
  );
  if (!success) {
    return res.status(400).json({ success, message, error });
  }
  const newAccessToken = await signAccessToken(record.userId);
  const newRefreshToken = await signRefreshToken(
    record.userId,
    record.createdAt
  );
  const updated = await updateSession(refreshToken, newRefreshToken);
  updated.success
    ? res
        .status(updated.status)
        .json({ success: true, newAccessToken, newRefreshToken })
    : res.status(updated.status).json({ success: false });
};
const signOut = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    const response = await endSession(refreshToken);
    res.status(response.status).json(response);
  } else {
    res
      .status(400)
      .json({ success: false, message: "you must provide the jwt token" });
  }
};

const sessions = async (req, res) => {
  const user = req.user;
  const userSessions = await listSessions({ userId: user.id });
  res.status(userSessions.status).json(userSessions);
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
