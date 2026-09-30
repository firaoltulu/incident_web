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

const { verifySign } = require("../../services/jwt");

const WorkFlowRouter = express.Router();

WorkFlowRouter.use(async (req, res, next) => {

    try {

        const body = req.body;
        let headers = [];

        for (let i = 0; i < req.rawHeaders.length; i += 2) {

            var key = req.rawHeaders[i];

            var newobj = Object.assign({}, {
                [key]: req.rawHeaders[i + 1],
            });

            headers.push(newobj);

        };

        const findauth = headers.find((row, index) => {

            try {
                if (row.Authorization) {
                    // console.log({ row });
                    return row;
                }
                else {
                    return null;
                }

            } catch (error) {
                return null;
            }
        });

        const token = findauth.Authorization ? findauth.Authorization : null;
        const didToken = token ? token.substr(7) : "";

        const { user } = await verifySign(didToken);

        if (user !== null) {

            body.user = user;
            next();
        }
        else {
            return res.status(400).json({
                error: "Error Authorization",
                done: false,
            });
        }

    } catch (error) {
        return res.status(400).json({
            error: "Error Authorization",
            done: false,
        });
    }

});

WorkFlowRouter.post("/register", httpAddNewWorkFlow);
WorkFlowRouter.get("/list", httpListWorkFlow);
WorkFlowRouter.get("/details/:workflowId", httpGetWorkflow);
// WorkFlowRouter.get("/listgroup", httpListGroupCompany);
WorkFlowRouter.put("/edit/:workflowId", httpEditWorkflow);

module.exports = WorkFlowRouter;