require("dotenv").config();
const express = require("express");
const connection = require("./config/dbConnection");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const routes = require("./router/index");
const scheduleTasks = require("./helpers/scheduler/tasks");

scheduleTasks();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/api/v1/", routes);

connection().then(() =>
  app.listen("8080", () => console.log("server listening at port 8080"))
);
