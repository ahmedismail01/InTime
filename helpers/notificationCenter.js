const userRepo = require("../modules/user/repo");
const { sendWebPushNotification } = require("./webPush");
const { getIo } = require("../sockets/instance");
const { userSocketMap } = require("../sockets");

const notifyUser = async (userId, payload) => {
  try {
    const { record, success } = await userRepo.update(
      {
        _id: userId,
      },
      {
        $push: { notifications: { message: payload.message } },
      },
    );

    if (!success) return;
    if (record.webSubscription) {
      sendWebPushNotification(record.webSubscription, JSON.stringify(payload));
    }

    const io = getIo();
    if (io) {
      io.to(userSocketMap[userId]).emit("notification", payload);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  notifyUser,
};
