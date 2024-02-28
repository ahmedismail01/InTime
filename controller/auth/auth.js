const {
  comparePassword,
  create,
  get,
  list,
  remove,
  update,
} = require("../../modules/user/repo");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
  const form = req.body;
  const response = await create(form);
  res.json(response);
};
const logIn = async (req, res) => {
  const form = req.body;
  const response = await comparePassword(form.email, form.password);
  if (response.success) {
    const token = jwt.sign(
      {
        id: response.record._id,
        email: response.record.email,
        date: Date.now(),
      },
      process.env.JWT_PRIVATE_KEY
    );
    response.record.token = token
    res.json(response);
  } else {
    res.json(response);
  }
};

const activation = async (req, res) => {
  const {otp , email} = req.body
};
const resetPassword = async (req, res) => {
  res.json("login");
};

module.exports = {
  signUp,
  logIn,
  activation,
  resetPassword,
};
