require("dotenv").config();
const express = require("express");
const app = express();
const { setupWebSocketServer } = require("./sockets/index");
const server = setupWebSocketServer(app);
const connection = require("./config/dbConnection");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./router/index");
const { scheduleTasks } = require("./helpers/scheduler/tasks");
const { limiter } = require("./utils/rateLimiter");
scheduleTasks();

app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/v1/", limiter, routes);

app.all("*", (req, res, next) => {
  res.status(404).json({ success: false, message: "cant find this page" });
});

connection().then(() =>
  server.listen("8080", () => console.log("server listening at port 8080")),
);
