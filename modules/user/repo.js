const User = require("./model");
const bcrypt = require("bcrypt");

const isExists = async (query) => {
  const object = await User.findOne(query);
  if (object)
    return {
      success: true,
      record: object,
      status: 200,
    };
  return {
    success: false,
    message: "user not found",
    status: 404,
  };
};

const list = async (query) => {
  try {
    if (query) return await User.find(query);
    else return await User.find({});
  } catch (err) {
    console.log("error getting users : " + err);
  }
};

const get = async (query) => {
  try {
    if (query) return await isExists(query);
    else return { message: "you have to send a query" };
  } catch (err) {
    console.log("error getting user : " + err);
  }
};

const create = async (form) => {
  try {
    const email = await isExists({ email: form.email });
    if (email.success) {
      return { success: false, message: "this email already exists" };
    }
    const user = new User(form);
    await user.save();
    return {
      success: true,
      record: user,
    };
  } catch (err) {
    console.log("error creating new user : " + err);
  }
};

const update = async (query, form) => {
  try {
    const isUserExists = await isExists(query);
    if (!isUserExists.success) {
      return { success: false, message: "user not found" };
    }
    const user = await User.findOneAndUpdate(query, form, { new: true });
    return {
      success: true,
      record: user,
    };
  } catch (err) {
    console.log("error updating user : " + err);
  }
};

const remove = async (filter) => {
  try {
    const exists = await isExists(filter);
    if (!exists.success) {
      return {
        success: false,
        message: "user not registered",
      };
    }
    await User.findByIdAndDelete(filter);
    return { success: true, message: "user deleted" };
  } catch (err) {
    console.log("error deleting user : " + err);
  }
};

const comparePassword = async (email, password) => {
  const user = await isExists({ email: email });
  if (!user.success) {
    return {
      success: false,
      message: "user not registered",
    };
  }
  const isMatched = await bcrypt.compare(password, user.record.password);
  if (!isMatched) {
    return { success: false, message: "wrong password" };
  }
  return {
    success: true,
    record: user.record,
  };
};

module.exports = {
  isExists,
  create,
  list,
  get,
  remove,
  update,
  comparePassword,
};
