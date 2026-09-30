const express = require("express");
// var { graphqlHTTP } = require('express-graphql');

const {
    httpAddNewAccident,
    httpListAccident,
    httpGetAccident,
    httpEditAccidentState,
    // httpListGroupAccident,
    httpEditAccident
} = require("./Accident.controller");

const { verifySign } = require("../../services/jwt");


const AccidentRouter = express.Router();

AccidentRouter.use(async (req, res, next) => {
    console.log("started");
    try {

        const body = req.body;
        let headers = [];
        // console.log(req.headers);
        // for (let i = 0; i < req.headers["authorization"].length; i += 2) {

        //     var key = req.headers["authorization"][i];

        //     var newobj = Object.assign({}, {
        //         [key]: req.headers["authorization"][i + 1],
        //     });

        //     headers.push(newobj);

        // };

        // const findauth = headers.find((row, index) => {

        //     try {
        //         if (row.Authorization) {
        //             // console.log({ row });
        //             return row;
        //         }
        //         else {
        //             return null;
        //         }

        //     } catch (error) {
        //         return null;
        //     }
        // });
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(400).json({
                error: "Missing Authorization header",
                done: false,
            });
        }

        // Strip "Bearer " prefix if present
        const didToken = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : authHeader;

        // const token = findauth.Authorization ? findauth.Authorization : null;
        // const didToken = token ? token.substr(7) : "";

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
        console.log(error);
        return res.status(400).json({
            error: "Error Authorization",
            done: false,
        });
    }
    // console.log("hello");

});

AccidentRouter.post("/register", httpAddNewAccident);
AccidentRouter.get("/list", httpListAccident);
AccidentRouter.get("/details/:accidentId", httpGetAccident);
AccidentRouter.put("/workflow/:accidentId", httpEditAccidentState);
// AccidentRouter.get("/listgroup", httpListGroupCompany);
AccidentRouter.put("/edit/:accidentId", httpEditAccident);

module.exports = AccidentRouter;