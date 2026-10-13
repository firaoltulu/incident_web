const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpLoginAuthorization,
    httpMy_accountAuthorization,
    httpRegisterNewAccountAuthorization,
    httpListUsersAuthorization,
    httpGetUserAuthorization,
    httpEditUserAuthorization,
    httpChangePasswordAuthorization,
    httpActiveAuthorization
} = require("./Authorization.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");

const AuthorizationRouter = express.Router();

AuthorizationRouter.post("/sign-in", httpLoginAuthorization);
AuthorizationRouter.post("/register", httpRegisterNewAccountAuthorization);

AuthorizationRouter.use(authenticate);
// AuthorizationRouter.use(authorize(process.env.USER_MODULE_KEY));

AuthorizationRouter.get("/me", httpMy_accountAuthorization);
AuthorizationRouter.get("/list", httpListUsersAuthorization);
AuthorizationRouter.get("/details/:userId", httpGetUserAuthorization);
AuthorizationRouter.put("/edit/:userId", httpEditUserAuthorization);
AuthorizationRouter.put("/changePassword/:userId", httpChangePasswordAuthorization);
AuthorizationRouter.put("/active/:userId", httpActiveAuthorization);


module.exports = AuthorizationRouter;