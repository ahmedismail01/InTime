const {
  comparePassword,
  create,
  update,
  isExists,
} = require("../../modules/user/repo");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../helpers/nodeMailer");

const bcrypt = require("bcrypt");
const {
  createOtp,
  verifyOtp,
  remove,
  removeOtp,
} = require("../../modules/otp/repo");

const generateOtp = async () => {
  return Math.floor(Math.random() * (9999 - 1000));
};
const createToken = (id, secret, props) => {
  return jwt.sign(payload, secret, props);
};

const signUp = async (req, res) => {
  const form = req.body;
  const theToken = await generateOtp();
  const response = await create(form);
  if (response.success) {
    const hashedOtp = await bcrypt.hash(`${theToken}`, 5);
    const otpForm = {
      email: form.email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800,
    };
    await createOtp(otpForm);
    const html = `<h1>${theToken}</h1>`;
    const title = "activate your account";
    const text = "click the link to activate your account";
    sendMail(response.record.email, title, text, html);
    res.json({
      email: response.record.email,
      otp: hashedOtp,
      message: "check your mail to activate your account",
    });
  } else {
    res.json(response);
  }
};

const logIn = async (req, res) => {
  const form = req.body;
  const { success, record, message } = await comparePassword(
    form.email,
    form.password
  );
  if (success) {
    const token = jwt.sign(
      {
        user: {
          id: record._id,
          isActive: record.isActive,
        },
      },
      process.env.JWT_PRIVATE_KEY
    );
    res.json({
      success,
      email: record.email,
      name: record.name,
      token,
    });
  } else {
    res.json({ success, message });
  }
};

const activation = async (req, res) => {
  const email = req.body.email;
  const { code } = req.params;
  const user = await isExists({ email: email });
  if (user.success) {
    if (user.record.isActive == false) {
      const isOtpValid = await verifyOtp(email, code);
      if (isOtpValid.success) {
        await removeOtp({ email: email });
        const response = await update({ email: email }, { isActive: true });
        res.json({
          success: response.success,
          message: "this account is now active",
        });
      } else {
        res.json({ success: false, message: isOtpValid.message });
      }
    } else {
      res.json({
        success: false,
        message: "this account is already activated",
      });
    }
  } else {
    res.json({ success: false, message: "this account is not registered" });
  }
};

const resetPassword = async (req, res) => {
  const response = await isExists({ email: req.body.email });

  if (response.success) {
    if (response.record.isActive == false) {
      res.json({
        success: false,
        message: "you have to activate the account first",
      });
    }

    const theToken = await generateOtp();
    await removeOtp({ email: req.body.email });
    const hashedOtp = await bcrypt.hash(`${theToken}`, 5);

    const otpForm = {
      email: req.body.email,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1800,
    };

    const otp = await createOtp(otpForm);
    const html = `<h1>use this code to reset your password : ${theToken}</h1>`;
    const title = "reset password";
    const text = "use this code to reset your account";
    sendMail(response.record.email, title, text, html);
    res.json({
      success: true,
      otp: hashedOtp,
      email: req.body.email,
      message: "check your mail",
    });
  } else {
    res.json({ success: false, message: "user not registered" });
  }
};

const changePassword = async (req, res) => {
  const { otp } = req.params;
  const { password, email } = req.body;
  const verifiedOtp = await verifyOtp(email, otp);
  const emailExists = await isExists({ email: email });
  if (verifiedOtp.success) {
    if (emailExists.success) {
      const ifOldPassEqualNewPass = await bcrypt.compare(
        password,
        emailExists.record.password
      );
      if (!ifOldPassEqualNewPass) {
        await update(
          { email: email },
          { password: await bcrypt.hash(password, 5) }
        );
        await removeOtp({ email: email });
        res.json({ success: true, message: "password changed" });
      } else {
        res.json({ success: false, message: "password must be unique" });
      }
    } else {
      res.json({ success: false, message: "this email doesnt exists" });
    }
  } else {
    res.json({ success: false, message: verifiedOtp.message });
  }
};

const resendActivationCode = async (req, res) => {
  const { email, password } = req.body;
  const user = await comparePassword(email, password);
  if (user.success) {
    if (user.record.isActive) {
      res.json({ success: false, message: "user already activated" });
    } else {
      const newOtp = generateOtp();
      await removeOtp({ email: email });
      const hashedOtp = await bcrypt.hash(`${newOtp}`, 5);
      const otpForm = {
        email: email,
        otp: hashedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + 1800,
      };
      await createOtp(otpForm);
      const html = `<h1>your code is : ${newOtp}</h1>`;
      const title = "activate your account";
      const text = "you have to enter this code to activate your account";
      sendMail(user.record.email, title, text, html);
      await update({ _id: user.record._id }, { otp: newOtp });
      res.json({ success: true, message: "code sent" });
    }
  } else {
    res.json({ success: false, message: user.message });
  }
};

module.exports = {
  signUp,
  logIn,
  activation,
  resetPassword,
  changePassword,
  resendActivationCode,
};
