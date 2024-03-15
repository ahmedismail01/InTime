require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");
const cors = require("cors");



app.use(cors());
app.use(express.json());
app.use(routes);

app.all("*", (req, res, next) => {
  res.json({ success: false, message: "cant find this page", status: 404 });
});

connection().then(() =>
  app.listen("8080", () => console.log("server listening at port 8080"))
);
