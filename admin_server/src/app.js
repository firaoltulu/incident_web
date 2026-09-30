const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const api = require("./routes/api");

const app = express();
const AuthorizationRouter = require("./routes/authorization/authorization.router");

app.use(
    cors({
        origin: true,
    })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use("/v1", api);
app.use("/v1/account/register", AuthorizationRouter);


module.exports = app;
