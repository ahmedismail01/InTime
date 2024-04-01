require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");
const cors = require("cors");
const { getCurrentTime } = require("./utils/currentTime");
const schedule = require("node-schedule");
const scheduleTasks = require("./helpers/scheduler/tasks");

scheduleTasks();

app.use(cors());
app.use(express.json());
app.use(
  "/api/v1/",
  (req, res, next) => {
    console.info("request : " + req.originalUrl);
    next();
  },
  routes
);

connection().then(() =>
  app.listen("8080", () => console.log("server listening at port 8080"))
);
