const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewCompany,
    httpListCompany,
    httpListGroupCompany,
    httpGetCompany,
    httpEditCompany,
    httpDeleteCompany
} = require("./Company.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");

const CompanyRouter = express.Router();

CompanyRouter.use(authenticate);
CompanyRouter.use(authorize(process.env.COMPANY_MODULE_KEY));

CompanyRouter.post("/register", httpAddNewCompany);
CompanyRouter.get("/list", httpListCompany);
CompanyRouter.get("/details/:companyId", httpGetCompany);
CompanyRouter.get("/listgroup", httpListGroupCompany);
CompanyRouter.put("/edit/:companyId", httpEditCompany);
CompanyRouter.delete("/delete/:companyId", httpDeleteCompany);

module.exports = CompanyRouter;