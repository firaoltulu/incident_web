const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewRole,
    httpListRoles,
    httpGetRole,
    httpEditRole,
    httpDeleteRole
    // httpListGroupCompany,
    // httpGetCompany,
    // httpEditCompany
} = require("./Role.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");

const RoleRouter = express.Router();

RoleRouter.use(authenticate);
RoleRouter.use(authorize(process.env.ROLE_MODULE_KEY));

RoleRouter.post("/register", httpAddNewRole);
RoleRouter.get("/list", httpListRoles);
RoleRouter.get("/details/:roleId", httpGetRole);
// RoleRouter.get("/listgroup", httpListGroupCompany);
RoleRouter.put("/edit/:roleId", httpEditRole);
RoleRouter.delete("/delete/:roleId", httpDeleteRole);

module.exports = RoleRouter;