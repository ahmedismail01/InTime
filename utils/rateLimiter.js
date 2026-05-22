const { default: rateLimit } = require("express-rate-limit");

const handler = (req, res, next, options) => {
  res
    .status(options.statusCode)
    .json({ success: false, message: options.message });
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: handler,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: handler,
});

module.exports = { limiter, authLimiter };
