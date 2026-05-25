const { verifyToken } = require("../helpers/jwtHelper");

module.exports = async (socket, next) => {
  const token = socket.handshake.headers.accesstoken;
  if (token) {
    const payload = await verifyToken(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
    );
    if (!payload) return next(new Error("Authentication error"));
    socket.user = payload.user;
    next();
  } else {
    next(new Error("Authentication error "));
  }
};
