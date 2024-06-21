require("dotenv").config();
const express = require("express");
const app = express();
const { setupWebSocketServer } = require("./sockets/index");
const server = setupWebSocketServer(app);
const connection = require("./config/dbConnection");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./router/index");
const scheduleTasks = require("./helpers/scheduler/tasks");
const bcrypt = require("bcrypt");

scheduleTasks();
const corsOptions = {
  credentials: true, // If you need to send cookies or authorization headers
};
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/", routes);

connection().then(() =>
  server.listen("8080", () => console.log("server listening at port 8080"))
);
