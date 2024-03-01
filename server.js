require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");
const cors = require('cors')

var corsOptions = {
  origin:"http://localhost:8080/",
  optionsSuccessStatus: 200 
}
app.use(cors(corsOptions))
app.use(express.json());
app.use(routes);

connection().then(() => app.listen("8080", () => console.log("server listening at port 8080")));
