require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");
const cors = require('cors')

var corsOptions = {
  origin:" https://intime-3.onrender.com",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(routes);

connection().then(() => app.listen("8080", () => console.log("server listening at port 8080")));
