const http = require("http");
const socketIo = require("socket.io");
const messageRepo = require("../modules/message/repo");
const userRepo = require("../modules/user/repo");
const authMiddleware = require("./auth");
const { setIo } = require("./instance");
const { default: mongoose } = require("mongoose");

const userSocketMap = {};

const setupWebSocketServer = (app) => {
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: ["https://in-time-liard.vercel.app", "http://localhost:3000"],
      credentials: true,
    },
  });

  setIo(io);
  io.use(authMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user?.id;
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    console.log(`Socket connected: ${userId}`);
    userSocketMap[userId] = socket.id;

    socket.on("joinProjectChat", (payload) => joinProjectChat(socket, payload));
    socket.on("message", (payload) => handleMessage(io, socket, payload));
    socket.on("disconnect", () => handleDisconnect(userId));
  });

  return server;
};

const joinProjectChat = async (socket, { projectId } = {}) => {
  if (!projectId) {
    socket.emit("error", { message: "projectId is required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    socket.emit("error", { message: "Invalid projectId" });
    return;
  }

  socket.join(projectId);
  const messages = await messageRepo.list({ projectId }, { timestamp: 1 });
  socket.emit("loadOldMessages", messages);
};

const handleMessage = async (io, socket, { message, projectId } = {}) => {
  if (!projectId || !message) {
    socket.emit("error", { message: "projectId and message are required" });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    socket.emit("error", { message: "Invalid projectId" });
    return;
  }

  const user = await userRepo.get({ _id: socket.user.id });
  const result = await messageRepo.create({
    userId: socket.user.id,
    message,
    projectId,
  });

  if (!result.success) {
    socket.emit("error", result);
    return;
  }

  io.to(projectId).emit("chatMessage", {
    message: result.record,
    user: user.record,
  });
};

const handleDisconnect = (userId) => {
  console.log(`Socket disconnected: ${userId}`);
  delete userSocketMap[userId];
};

module.exports = { setupWebSocketServer, userSocketMap };
