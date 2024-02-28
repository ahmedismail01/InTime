require("dotenv").config();
const express = require("express");
const app = express();
const connection = require("./config/dbConnection");
const routes = require("./router/index");

app.use(express.json());
app.use(routes);
connection().then(() => app.listen("8080", () => console.log("server listening at port 8080")));
