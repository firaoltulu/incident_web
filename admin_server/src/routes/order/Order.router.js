const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewOrder,
    httpListOrder,
    httpGetOrder,
    httpEditOrder,
    httpEditOrderStatus
} = require("./Order.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");

const OrderRouter = express.Router();

OrderRouter.use(authenticate);
OrderRouter.use(authorize(process.env.ORDER_MODULE_KEY || "69a44c86f9c90c9348ed19f5")); // Using COMPANY_MODULE_KEY as fallback if ORDER_MODULE_KEY not in .env


OrderRouter.post("/register", httpAddNewOrder);
OrderRouter.get("/list", httpListOrder);
OrderRouter.get("/details", httpGetOrder);
OrderRouter.post("/edit", httpEditOrder);
OrderRouter.post("/editstatus", httpEditOrderStatus);


module.exports = OrderRouter;