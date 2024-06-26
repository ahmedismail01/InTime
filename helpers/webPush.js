const webpush = require("web-push");
const User = require("../modules/user/model");
exports.handleWebPushForTasks = async (task, payload) => {
  try {
    const userId = task.userId;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { notifications: { message: JSON.parse(payload).message } } }
    );
    if (!user.webSubscription) {
      return console.log(`${user.email} doesnt have a webSub`);
    }
    console.log("sending web notification");
    this.sendWebPushNotification(user.webSubscription, payload);
  } catch (error) {
    console.log(error);
  }
};
exports.handleWebPushForUsers = async (userId, payload) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { notifications: { message: JSON.parse(payload).message } } }
    );
    if (!user.webSubscription) {
      return console.log(`${user.email} doesnt have a webSub`);
    }
    console.log("sending web notification");
    this.sendWebPushNotification(user.webSubscription, payload);
  } catch (err) {
    console.log(err);
  }
};

exports.sendWebPushNotification = (sub, payload) => {
  webpush.setVapidDetails(
    "mailto:ahmed.ism1990.ai@gmail.com",
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );
  webpush.sendNotification(sub, payload).catch((err) => console.log(err));
};
