const { verifyToken } = require("../../helpers/jwtHelper");
const RefreshTokens = require("./model");
const bcrypt = require("bcrypt");

const isExists = async (query) => {
  const object = await RefreshTokens.findOne(query);
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

const verifyRefreshToken = async (token) => {
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
    if (!payload) {
      return { success: false, message: "Unauthorized" };
    }
    const exists = await isExists({ userId: payload.id });
    if (!exists.success) {
      return { success: false, message: "session expired" };
    }
    const compareRefreshTokens = await bcrypt.compare(
      token,
      exists.record.refreshToken
    );
    if (!compareRefreshTokens) {
      return { success: false, message: "Invalid Token" };
    }
    return { success: true, record: exists.record };
  } catch (error) {
    console.log("error verifing the RefreshToken : " + error);
  }
};

const createRefreshToken = async (token) => {
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
    if (!payload) {
      return { success: false, message: "Unauthorized" };
    }
    const refreshToken = await RefreshTokens.create({
      userId: payload.id,
      refreshToken: token,
    });
    if (refreshToken) {
      return { success: true };
    } else {
      return { success: false, message: "something went wrong" };
    }
  } catch (error) {
    console.log("error creating the RefreshToken : " + error);
  }
};

const endSession = async (token) => {
  try {
    const payload = await verifyToken(
      token,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );
    if (!payload) {
      return { success: false, message: "Unauthorized" };
    }
    const session = await RefreshTokens.findOne({ userId: payload.id });
    if (!session) {
      return { success: false, message: "session expired" };
    }

    const compareTokens = await bcrypt.compare(token, session.refreshToken);
    if (!compareTokens) {
      return { success: false, message: "Unauthorized" };
    }
    await RefreshTokens.deleteOne({ _id: session._id });
    return {
      success: true,
    };
  } catch (err) {
    console.log("error removing the RefreshToken : " + err);
  }
};

const updateSession = async (token) => {
  try {
    const hashedToken = await bcrypt.hash(token, 5);
    const updated = await RefreshTokens.findOneAndUpdate({
      refreshToken: hashedToken,
    });
    if (updated) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.log("error updating refreshToken session : " + error);
  }
};

const listSessions = async (filter) => {
  try {
    const userSessions = await RefreshTokens.find(filter);
    return {
      success: true,
      record: userSessions,
    };
  } catch (error) {
    console.log("error listing refreshToken sessions : " + error);
  }
};
module.exports = {
  verifyRefreshToken,
  createRefreshToken,
  endSession,
  updateSession,
  listSessions,
};
