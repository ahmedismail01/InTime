const jwt = require("jsonwebtoken");
const signAccessToken = (id) => {
  return jwt.sign(
    {
      user: {
        id,
      },
    },
    process.env.ACCESS_TOKEN_PRIVATE_KEY,
    { expiresIn: "300s" }
  );
};
const signRefreshToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.REFRESH_TOKEN_PRIVATE_KEY,
    { expiresIn: "7d" }
  );
};

const verifyToken = (token, secret) => {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    console.log("error verifing the token : " + err);
  }
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
};
