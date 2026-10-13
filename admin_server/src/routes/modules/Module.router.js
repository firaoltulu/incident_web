const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpListModule,
} = require("./Module.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");


const ModuleRouter = express.Router();

ModuleRouter.use(authenticate);
ModuleRouter.use(authorize(process.env.ROLE_MODULE_KEY));

// ModuleRouter.post("/register", httpAddNewCompany);
ModuleRouter.get("/list", httpListModule);
// ModuleRouter.get("/details/:companyId", httpGetCompany);
// ModuleRouter.get("/listgroup", httpListGroupCompany);
// ModuleRouter.put("/edit/:companyId", httpEditCompany);

module.exports = ModuleRouter;