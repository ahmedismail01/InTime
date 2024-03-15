const OTP = require("./model");
const bcrypt = require("bcrypt");
const isExists = async (query) => {
  const object = await OTP.findOne(query);
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

const verifyOtp = async (email, otp) => {
  const exists = await isExists({ email: email });
  if (exists.success) {
    if(exists.record.expiresAt < Date.now()){
    if (await bcrypt.compare(otp, exists.record.otp)) {
      return { success: true, record: otp };
    } else {
      return { success: false, message: "wrong otp" };
    }
  } else {
    return { success: false, message: "token expired" };
    }
  }else {
    return { success: false, message: "token invalid" };
    }
};
const createOtp = async (form) => {
  const otp = await OTP.create(form);
  if (otp) {
    return { success: true, record: otp };
  } else {
    return { success: false, message: "something went wrong" };
  }
};
const removeOtp = async (filter) => {
  if (filter) {
    const otp = await OTP.deleteOne(filter);
  } else {
    return { success: false, message: "you have to send a filter" };
  }
};

module.exports = {
  verifyOtp,
  createOtp,
  removeOtp,
};
