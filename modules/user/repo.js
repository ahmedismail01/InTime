const User = require("./model");
const bcrypt = require('bcrypt')

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
    status: 404,
  };
};

const list = async (query) => {
  if (query) return await User.find(query);
  else return await User.find({});
};
const get = async (query) => {
  if (query) return await User.findOne(query);
  else return { message: "you have to send a query" };
};
const create = async (form) => {
  const email = await isExists({ email: form.email });
  if (email.success)
    return { success: false, message: "this email already exists" };
  else {
    const user = new User(form);
    await user.save();
    return {
      success: true,
      record: user,
    };
  }
};

const update = async (id, form) => {
  const isUserExists = await isExists({ _id: id });
  if (isUserExists.success) {
    await User.updateOne({ _id: id }, form);
    const user = await User.findById({_id: id})
    return {
      success: true,
      record: user,
    };
  } else {
    return { success: false, message: "user not found" };
  }
};

const remove = async (id) => {
  const isexists = await isExists({ _id: id });
  if (isexists.success) {
    await User.findByIdAndDelete({ _id: id });
    return { message: "user deleted" };
  } else {
    return {
      message: "this user doesnt exists",
    };
  }
};
const comparePassword = async (email, password) => {
  const user = await isExists({ email: email });
  if (user.success) {
    const isMatched = await bcrypt.compare(password, user.record.password);
    if (isMatched) {
      return {
        success: true,
        record: user.record,
      };
    } else {
      return { success: false, message: "wrong password" };
    }
  } else {
    return {
      success: false,
      message: "you have to register first",
    };
  }
};

module.exports = {
  create,
  list,
  get,
  remove,
  update,
  comparePassword,
};
