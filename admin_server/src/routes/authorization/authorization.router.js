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

const AuthorizationRouter = express.Router();


AuthorizationRouter.post("/sign-in", httpLoginAuthorization);


AuthorizationRouter.get("/me", httpMy_accountAuthorization);

AuthorizationRouter.post("/register", httpRegisterNewAccountAuthorization);
AuthorizationRouter.get("/list", httpListUsersAuthorization);
AuthorizationRouter.get("/details/:userId", httpGetUserAuthorization);
AuthorizationRouter.put("/edit/:userId", httpEditUserAuthorization);
AuthorizationRouter.put("/changePassword/:userId", httpChangePasswordAuthorization);
AuthorizationRouter.put("/active/:userId", httpActiveAuthorization);


module.exports = AuthorizationRouter;