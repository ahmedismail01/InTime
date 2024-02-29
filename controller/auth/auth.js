const {
  comparePassword,
  create,
  get,
  list,
  remove,
  update,
  isExists,
} = require("../../modules/user/repo");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../helpers/nodeMailer");

const signUp = async (req, res) => {
  const form = req.body;
  const theToken = Math.floor(Math.random() * (99999 - 10000));
  form.otp = theToken;
  const response = await create(form);
  if (response.success) {
    const html = `<a>http://localhost:8080/api/v1/auth/activation/${theToken}</a>`;
    const title = "activate your account";
    const text = "click the link to activate your account";
    sendMail(response.record.email, title, text, html);
    res.json({
      user: response.record.name,
      email: response.record.email,
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
  console.log(success);
  if (success) {
    const token = jwt.sign(
      {
        user: record.name,
        email: record.email,
        id: record._id,
        role: record.role,
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
  const otp = req.params.otp;
  try {
    const user = await isExists({ email: email });
    if (user) {
      if (user.record.isActive == false) {
        const response = await update(
          { email: email, otp: otp },
          { isActive: true }
        );
        if (response.success) {
          res.json({
            success: response.success,
            message: "this account is now active",
          });
        } else {
          res.json({ success: false, message: "invalid code" });
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
  } catch (err) {
    res.json(err);
  }
};
const resetPassword = async (req, res) => {
  const response = await isExists({ email: req.body.email });
  const token = jwt.sign(
    { email: response.record.email },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: 900 }
  );
  if (response.success) {
    const html = `<a>${token}</a>`;
    const title = "activate your account";
    const text = token;
    sendMail(response.record.email, title, text, html);
    res.json({
      user: response.record.name,
      email: response.record.email,
      message: "check your mail",
    });
  } else {
    res.json(response);
  }
};

const changePassword = async (req, res) => {
  const newPass = req.body.password;
  const email = req.user.email;
  const exists = await isExists({ email, email });
  if (exists) {
    if (exists.record.password != newPass) {
      const response = await update({ email: email }, { password: newPass });
      res.json({ success: response.success });
    } else {
      res.json({ success: false, message: "the new password must be unique" });
    }
  } else {
    res.json({ success: false });
  }
};

module.exports = {
  signUp,
  logIn,
  activation,
  resetPassword,
  changePassword,
};
