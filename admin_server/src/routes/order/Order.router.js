const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewOrder,
    httpListOrder,
    httpGetOrder,
    httpEditOrder,
    httpEditOrderStatus
} = require("./Order.controller");

const OrderRouter = express.Router();


OrderRouter.post("/register", httpAddNewOrder);
OrderRouter.get("/list", httpListOrder);
OrderRouter.get("/details", httpGetOrder);
OrderRouter.post("/edit", httpEditOrder);
OrderRouter.post("/editstatus", httpEditOrderStatus);


module.exports = OrderRouter;