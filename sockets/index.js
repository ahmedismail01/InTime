const http = require("http");
const socketIo = require("socket.io");
// const socketHandlers = require("./socketHandlers");
const messageRepo = require("../modules/message/repo");
const userRepo = require("../modules/user/repo");
const scheduleTasks = require("../helpers/scheduler/tasks");
const { verifyToken } = require("../helpers/jwtHelper");

let io;
const userSocketMap = {};

const setupWebSocketServer = (app) => {
  const server = http.createServer(app);
  io = socketIo(server);
  io.use(async (socket, next) => {
    const token = socket.handshake.headers.accesstoken;
    if (token) {
      const payload = await verifyToken(
        token,
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      if (!payload) return next(new Error("Authentication error"));
      socket.user = payload.user;
      next();
    } else {
      next(new Error("Authentication error "));
    }
  });

  io.on("connection", async (socket) => {
    console.log("New client connected");
    const userId = socket.user.id;
    userSocketMap[userId] = socket.id;
    const user = await userRepo.get({ _id: socket.user.id });
    socket.on("joinProjectChat", async (data) => {
      socket.join(data.projectId);
      const messages = await messageRepo.list(
        { projectId: data.projectId },
        { timestamp: 1 }
      );
      socket.emit("loadOldMessages", messages);
    });

    socket.on("message", async (data) => {
      const { message, projectId } = data;
      const newMessage = await messageRepo.create({
        userId: socket.user.id,
        message,
        projectId: projectId,
      });

      if (newMessage.success) {
        newMessage.user = user.record;
        io.to(projectId).emit("chatMessage", {
          message: newMessage.record,
          user: user.record,
        });
      } else {
        socket.emit("error", newMessage);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return server;
};

module.exports = { setupWebSocketServer };
