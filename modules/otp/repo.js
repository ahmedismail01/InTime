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
const generateOtp = async () => {
  return Math.floor(Math.random() * 9000 + 1000);
};

const verifyOtp = async (query, otp) => {
  try {
    const exists = await isExists(query);
    if (!exists.success) {
      return { success: false, message: "OTP not found" };
    }
    const compareOtp = await bcrypt.compare(otp, exists.record.otp);
    if (!compareOtp) {
      return { success: false, message: "Invalid OTP" };
    }
    return { success: true, record: otp };
  } catch (error) {
    console.log("error verifing the otp : " + error);
    return {
      success: false,
      error: error,
      message: "something went wrong",
      status: 500,
    };
  }
};

const createOtp = async (query) => {
  try {
    const token = await generateOtp();
    const hashedOtp = await bcrypt.hash(`${token}`, 5);
    const otpForm = {
      email: query.email,
      projectId: query.projectId,
      otp: hashedOtp,
    };
    const otp = await OTP.create(otpForm);
    if (otp) {
      return { success: true, otp: token };
    } else {
      return { success: false, message: "something went wrong" };
    }
  } catch (error) {
    console.log("error creating the otp : " + error);
    return {
      success: false,
      error: error,
      message: "something went wrong",
      status: 500,
    };
  }
};

const removeOtp = async (filter) => {
  try {
    if (filter) {
      const otp = await OTP.deleteOne(filter);
      return {
        success: true,
        record: otp,
      };
    } else {
      return { success: false, message: "you have to send a filter" };
    }
  } catch (err) {
    console.log("error removing the otp : " + err);
    return {
      success: false,
      error: err,
      message: "something went wrong",
      status: 500,
    };
  }
};

module.exports = {
  verifyOtp,
  createOtp,
  removeOtp,
};
