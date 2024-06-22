const webpush = require("web-push");
const User = require("../modules/user/model");
exports.handleWebPushForTasks = async (task, payload) => {
  try {
    const userId = task.userId;
    const user = await User.updateOne(
      { _id: userId },
      { $push: { notifications: JSON.parse(payload).message } }
    );
    if (!user.webSubscription) {
      console.log(`${user.record.email} doesnt have a webSub`);
    }
    console.log("sending web notification");
    this.sendWebPushNotification(user.webSubscription, payload);
  } catch (error) {
    console.log(error);
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
