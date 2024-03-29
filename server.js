require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");
const cors = require("cors");
const { getCurrentTime } = require("./utils/currentTime");
app.use(cors());
app.use(express.json());
app.use(
  "/api/v1/",
  (req, res, next) => {
    console.info(
      `${getCurrentTime()}` +
        " request : " +
        req.hostname +
        " " +
        req.originalUrl
    );
    next();
  },
  routes
);



connection().then(() =>
  app.listen("8080", () => console.log("server listening at port 8080"))
);
