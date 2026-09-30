const express = require("express");
const jwt = require("jsonwebtoken");
var { graphqlHTTP } = require('express-graphql');

// const schema = require("../scheme/requestscheme");

// const admin = require("firebase-admin");

// const serviceAccount = require('../privates/serviceAccountKey.json'); // Your downloaded file


// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     projectId: serviceAccount.project_id,
// });


// async function verifyFirebaseToken(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ error: "No token provided" });
//     }
//     const idToken = authHeader.split(" ")[1]; // extract token
//     try {
//         const decoded = await admin.auth().verifyIdToken(idToken);
//         req.user = decoded; // attach Firebase user to request
//         next(); // go to next middleware/route
//     } catch (err) {
//         console.error("Token verification failed", err);
//         return res.status(401).json({ error: "Invalid token" });
//     }
// }


const AuthorizationRouter = require("./authorization/authorization.router");
const CompanyRouter = require("./company/Company.router");
const OrderRouter = require("./order/Order.router");
const ModuleRouter = require("./modules/Module.router");
const RoleRouter = require("./user_role/Role.router");
const ModuleStateRouter = require("./module_state/Module_State.router");
const WorkFlowRouter = require("./workflow/Workflow.router");
const AccidentRouter = require("./accident/Accident.router");
const ButtonRouter = require("./button/Button.router");

const api = express.Router();

// api.use(async (req, res, next) => {
//     await verifyFirebaseToken(req, res, next);
// });


api.use("/auth", AuthorizationRouter);
api.use("/company", CompanyRouter);
api.use("/order", OrderRouter);
api.use("/module", ModuleRouter);
api.use("/role", RoleRouter);
api.use("/modulestate", ModuleStateRouter);
api.use("/workflow", WorkFlowRouter);
api.use("/accident", AccidentRouter);
api.use("/button", ButtonRouter);

module.exports = api;
