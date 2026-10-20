const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewWorkFlow,
    httpListWorkFlow,
    httpGetWorkflow,
    // httpListGroupCompany,
    // httpGetCompany,
    httpEditWorkflow
} = require("./Workflow.controller");

const { authenticate } = require("../../lib/verifytoken");
const { authorize } = require("../../lib/authorize");

const WorkFlowRouter = express.Router();

WorkFlowRouter.use(authenticate);

WorkFlowRouter.get("/list", httpListWorkFlow);
WorkFlowRouter.get("/details/:workflowId", httpGetWorkflow);

WorkFlowRouter.use(authorize(process.env.WORKFLOW_MODULE_KEY));

WorkFlowRouter.post("/register", httpAddNewWorkFlow);
// WorkFlowRouter.get("/listgroup", httpListGroupCompany);
WorkFlowRouter.put("/edit/:workflowId", httpEditWorkflow);

module.exports = WorkFlowRouter;