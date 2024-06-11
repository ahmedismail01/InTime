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
    status: 400,
  };
};

const verifyRefreshToken = async (token) => {
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
    if (!payload) {
      return {
        success: false,
        message: "Unauthorized",
        status: 401,
      };
    }
    const exists = await isExists({
      userId: payload.id,
      createdAt: payload.createdAt,
    });
    if (!exists.success) {
      return {
        success: false,
        message: "session expired",
        status: exists.status,
      };
    }
    const compareRefreshTokens = await bcrypt.compare(
      token,
      exists.record.refreshToken
    );
    if (!compareRefreshTokens) {
      return {
        success: false,
        message: "Invalid Token",
        status: 401,
      };
    }
    return {
      success: true,
      record: exists.record,
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
};

const createRefreshToken = async (token, createdAt) => {
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
    if (!payload) {
      return { success: false, message: "Unauthorized", status: 401 };
    }
    const refreshToken = await RefreshTokens.create({
      userId: payload.id,
      createdAt,
      refreshToken: token,
    });
    if (refreshToken) {
      return { success: true, status: 200 };
    } else {
      return { success: false, message: "something went wrong", status: 500 };
    }
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
};

const endSession = async (token) => {
  try {
    const payload = await verifyToken(
      token,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    if (!payload) {
      return { success: false, message: "Unauthorized", status: 401 };
    }

    const session = await RefreshTokens.findOne({
      userId: payload.id,
      createdAt: payload.createdAt,
    });

    if (!session) {
      return {
        success: false,
        message: "Session expired or not found",
        status: 401,
      };
    }

    const compareTokens = await bcrypt.compare(token, session.refreshToken);

    if (!compareTokens) {
      return { success: false, message: "Unauthorized", status: 401 };
    }

    await RefreshTokens.deleteOne({ _id: session._id });

    return {
      success: true,
      message: "Session ended successfully",
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      message: "Something went wrong",
      error: err.message,
      status: 500,
    };
  }
};

const updateSession = async (token, newToken) => {
  try {
    const payload = verifyToken(token, process.env.REFRESH_TOKEN_PRIVATE_KEY);
    if (!payload) {
      return { success: false, message: "Unauthorized", status: 401 };
    }
    const hashedToken = await bcrypt.hash(token, 5);
    const updated = await RefreshTokens.findOneAndUpdate(
      { userId: payload.id, createdAt: payload.createdAt },
      {
        refreshToken: hashedToken,
      }
    );
    if (updated) {
      return { success: true, status: 200 };
    } else {
      return { success: false, status: 400 };
    }
  } catch (error) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
};

const listSessions = async (filter) => {
  try {
    const userSessions = await RefreshTokens.find(filter)
      .select("-refreshToken")
      .select("-userId");
    return {
      success: true,
      record: userSessions,
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
};

const deleteSessions = async (filter) => {
  try {
    await RefreshTokens.deleteOne(filter);
    return {
      success: true,
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      message: "something went wrong",
      error: err,
      status: 500,
    };
  }
};
module.exports = {
  verifyRefreshToken,
  createRefreshToken,
  endSession,
  updateSession,
  listSessions,
  deleteSessions,
};
