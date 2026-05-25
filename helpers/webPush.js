const webpush = require("web-push");
const User = require("../modules/user/model");

webpush.setVapidDetails(
  "mailto:ahmed.ism1990.ai@gmail.com",
  process.env.WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY,
);

exports.sendWebPushNotification = (sub, payload) => {
  webpush.sendNotification(sub, payload).catch((err) => console.log(err));
};
