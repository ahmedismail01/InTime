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
      return {
        success: false,
        message: "this email already exists",
        status: 400,
      };
    }
    const user = new User(form);
    await user.save();
    return {
      success: true,
      record: user,
      status: 201,
    };
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      status: 500,
      error: err,
    };
  }
};

const update = async (query, form) => {
  try {
    const isUserExists = await isExists(query);
    if (!isUserExists.success) {
      return { success: false, message: "user not found", status: 400 };
    }
    const user = await User.findOneAndUpdate(query, form, { new: true });
    return {
      success: true,
      record: user,
      status: 201,
    };
  } catch (err) {
    console.log("error updating user : " + err);
    return {
      success: false,
      record: "something went wrong",
      status: 500,
    };
  }
};

const remove = async (filter) => {
  try {
    const exists = await isExists(filter);
    if (!exists.success) {
      return {
        success: false,
        message: "user not registered",
        status: 404,
      };
    }
    await User.findByIdAndDelete(filter);
    return { success: true, message: "user deleted", status: 200 };
  } catch (err) {
    console.log("error deleting user : " + err);
    return {
      success: false,
      record: "something went wrong",
      status: 500,
    };
  }
};

const comparePassword = async (email, password) => {
  const user = await isExists({ email: email });
  if (!user.success) {
    return {
      success: false,
      message: "user not registered",
      status: 404,
    };
  }
  const isMatched = await bcrypt.compare(password, user.record.password);
  if (!isMatched) {
    return { success: false, message: "wrong password", status: 400 };
  }
  return {
    success: true,
    record: user.record,
    status: 200,
  };
};

const addPoints = async (filter, pointsEarned) => {
  try {
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
  const { success, record, message, status } = await isExists(filter);
  if (!success) {
    return { success, message, status };
  }
  const currentDate = new Date();
  const currentDay = currentDate.toISOString().split("T")[0];
  const currentMonth = currentDay.slice(5, 7);
  const currentYear = currentDay.slice(0, 4);

  //daily
  const dailyIndex = record.points.daily.findIndex(
    (point) => point.date.toISOString().split("T")[0] === currentDay
  );
  if (dailyIndex !== -1) {
    record.points.daily[dailyIndex].value += pointsEarned;
  } else {
    record.points.daily.push({ date: currentDate, value: pointsEarned });
  }
  //monthly
  const monthlyIndex = record.points.monthly.findIndex(
    (point) => point.month == currentMonth && point.year == currentYear
  );
  if (monthlyIndex !== -1) {
    record.points.monthly[monthlyIndex].value += pointsEarned;
  } else {
    record.points.monthly.push({
      month: currentMonth,
      year: currentYear,
      value: pointsEarned,
    });
  }
  //yearly
  const yearlyIndex = record.points.yearly.findIndex(
    (point) => point.year == currentYear
  );
  console.log(yearlyIndex, monthlyIndex);
  if (yearlyIndex !== -1) {
    record.points.yearly[yearlyIndex].value += pointsEarned;
  } else {
    record.points.yearly.push({ year: currentYear, value: pointsEarned });
  }
  record.points.totalPoints += pointsEarned;

  // Save the updated user
  const updatedUser = await record.save();
  return {
    success,
    user: updatedUser,
    status: 200,
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
  addPoints,
};
