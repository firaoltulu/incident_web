const fs = require("fs");
const path = require("path");
require('dotenv').config();
const { AccidentSchema } = require("../../schema/AccidentSchema");

const {
    existsAccidentWithId,
    AddNewAccident,
    getAllAccident,
    EditAccidentById,
    AbortAccidentById,
    getAllCompanyAccident

} = require("../../models/accident/Accident.model");

const { existsWorkFlowWithModuleId } = require("../../models/workflow/WorkFlow.model");

const { existsCompanyWithId } = require("../../models/company/Company.model");

const { getAvailableWorkflowActions, canEditDocument } = require("../../services/workflowEngine");

const { getAllButtons } = require("../../models/button/Button.model");

// import fs from "fs";
// import path from "path";
// import { AccidentSchema } from "../../schema/AccidentSchema.js";
// import { AddNewAccident } from "../../models/accident/Accident.model.js";



const ACCIDENT_MODULE_ID = process.env.ACCIDENT_MODULE_ID;
const USER_ROLE_ADMIN = process.env.USER_ROLE_ADMIN;
const ADMINISTRATOR_ROLE_ID = "69afda7ce222d7d9af50ab1c";


async function httpAddNewAccident(req, res) {

    try {

        const body = req.body;

        const result = AccidentSchema.safeParse(body);

        if (result.success) {
            const exists_WorkFlow = await existsWorkFlowWithModuleId(ACCIDENT_MODULE_ID);

            const stateHistoryObj = Array({
                state: exists_WorkFlow ? exists_WorkFlow.States[0]?.state : null,
                date: new Date().toISOString(),
                by: body?.user?.Id ? body.user.Id : "",
            });

            const newLaunch = Object.assign({}, {
                ...result.data,
                company: body?.user?.Company ? body?.user?.Company : null,
                state: exists_WorkFlow ? exists_WorkFlow.States[0]?.state : null,
                stateHistory: stateHistoryObj,
            });

            const new_accident = await AddNewAccident(newLaunch);

            if (new_accident.done === true) {
                return res.status(200).json({ message: "Accident successfully added", reason: 1, accident: new_accident.accident });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, accident: null });
            }

        } else {
            return res.status(400).json({ message: result.error.message, reason: 3, accident: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 4, accident: null });
    }

};

async function httpListAccident(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const userRoles = body.user.Roles.map((row) => String(row._id))

        if (!userRoles.includes(USER_ROLE_ADMIN)) {
            const response = await getAllCompanyAccident(0, 0, body?.user?.Company);
            return res.status(200).json({ message: "Accident get was successful!!", reason: 1, accidents: response });
        }
        else {
            const response = await getAllAccident(0, 0);
            return res.status(200).json({ message: "Accident get was successful!!", reason: 1, accidents: response });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, accidents: [] });
    }

};

async function httpGetAccident(req, res) {

    try {

        const { accidentId } = req.query;

        const exists_Accident = await existsAccidentWithId(accidentId);

        if (exists_Accident) {

            var new_obj = Object.assign({
                id: exists_Accident._id,
                ...exists_Accident._doc
            });

            return res.status(200).json({ message: "Accident get was successful!!", reason: 1, accident: new_obj });
        } else {
            return res.status(400).json({ message: "Accident does not exist", reason: 2, accident: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, accident: null });
    }
};

async function httpEditAccidentState(req, res) {

    try {
        const body = req.body;

        const { accidentId } = req.params;

        console.log(accidentId);
        const exists_WorkFlow = await existsWorkFlowWithModuleId(ACCIDENT_MODULE_ID);
        const all_actions = await getAllButtons();

        if (exists_WorkFlow) {

            const exists_accident = await existsAccidentWithId(accidentId);

            if (exists_accident) {

                const Ava_actions = getAvailableWorkflowActions({
                    workflow: exists_WorkFlow,
                    currentStateId: exists_accident.state._id,
                    userRoles: body.user.Roles,
                    actions: all_actions
                });

                if (Ava_actions.length > 0) {

                    const found_rule = Ava_actions.find((row) => {
                        if (String(row._id) === String(body._id)) {
                            return row;
                        }
                        else {
                            return null;
                        }
                    });

                    if (found_rule) {

                        var newHistoryEntry = Object.assign({
                            state: found_rule.nextStateId._id,
                            date: new Date().toISOString(),
                            by: body.user.Id
                        });

                        const historyArray = Array.isArray(exists_accident.stateHistory)
                            ? [...exists_accident.stateHistory]
                            : [];

                        historyArray.push(newHistoryEntry);

                        var new_obj = Object.assign({
                            state: found_rule.nextStateId._id,
                            stateHistory: historyArray
                        });

                        const { done, accident } = await EditAccidentById(exists_accident._id, new_obj);

                        if (done === true) {
                            return res.status(200).json({ message: "Accident State successfully edited", reason: 1, accident: accident });
                        }
                        else {
                            return res.status(400).json({ message: "Required fields not specfied", reason: 2, accident: null });
                        }

                    } else {
                        return res.status(400).json({ message: "Required fields not specfied", reason: 3, accident: null });
                    }

                } else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 4, accident: null });
                }


            } else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 5, accident: null });
            }


        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 6, accident: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 7, accident: null });
    }
};

async function httpEditAccident(req, res) {

    try {
        const body = req.body;

        const { accidentId } = req.params;

        const result = AccidentSchema.safeParse(body);

        const exists_WorkFlow = await existsWorkFlowWithModuleId(ACCIDENT_MODULE_ID);

        if (result.success) {

            if (exists_WorkFlow) {

                const exists_accident = await existsAccidentWithId(accidentId);

                if (exists_accident) {

                    const can_Edit = canEditDocument({
                        workflow: exists_WorkFlow,
                        stateId: exists_accident.state._id,
                        userRoles: body.user.Roles,
                    });

                    if (can_Edit) {

                        const new_obj = Object.assign({}, {
                            ...result.data,
                        });

                        const { done, accident } = await EditAccidentById(exists_accident._id, new_obj);

                        if (done === true) {
                            return res.status(200).json({ message: "Accident successfully edited", reason: 1, accident: accident });
                        }
                        else {
                            return res.status(400).json({ message: "Required fields not specfied", reason: 2, accident: null });
                        }
                    } else {
                        return res.status(400).json({ message: "Required fields not specfied", reason: 3, accident: null });
                    }


                } else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 4, accident: null });
                }

            } else {

                const new_obj = Object.assign({}, {
                    ...result.data,
                });

                const { done, accident } = await EditAccidentById(accidentId, new_obj);

                if (done === true) {
                    return res.status(200).json({ message: "Accident successfully edited", reason: 1, accident: accident });
                }
                else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 2, accident: null });
                }

            }

        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 6, accident: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 7, accident: null });
    }
};

async function httpDeleteAccident(req, res) {
    try {
        const { accidentId } = req.params;
        const user = req.body?.user;
        const userRoles = Array.isArray(user?.Roles) ? user.Roles : [];
        const isAdmin = userRoles.some(
            (role) => String(role?._id || role?.id || role) === ADMINISTRATOR_ROLE_ID
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only administrators can delete accidents",
                reason: 5,
            });
        }

        const result = await AbortAccidentById(accidentId);

        if (result.done) {
            return res.status(200).json({ message: "Accident successfully deleted", reason: 1 });
        }

        return res.status(404).json({ message: "Accident does not exist", reason: 2 });
    } catch (error) {
        console.error("Failed to delete accident:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid accident ID", reason: 3 });
        }
        return res.status(500).json({ message: "Failed to delete accident", reason: 4 });
    }
};


module.exports = {
    httpAddNewAccident,
    httpListAccident,
    httpGetAccident,
    httpEditAccidentState,
    httpEditAccident,
    httpDeleteAccident
    // httpListGroupAccident,
};
