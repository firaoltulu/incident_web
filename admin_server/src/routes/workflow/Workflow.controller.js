const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsWorkFlowWithId,
    AddNewWorkFlow,
    getAllWorkFlow,
    EditWorkFlowById,
    AbortWorkFlowById,
    existsWorkFlowWithModuleId,
} = require("../../models/workflow/WorkFlow.model");

const {
    existsModuleWithId,
    AddNewModule,
    getAllModule,
    EditModuleById,
    AbortModuleById,
} = require("../../models/module_role/Module_Role.model");

const { getPagination } = require("../../services/query");

const { WorkFlowSchema } = require("../../schema/WorkFlowSchema");



const onTransitionSubmitCorrect = async (transition_rules = []) => {

    const keys = ["state", "action", "next_state", "allowed"];

    return transition_rules.map(row => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });

};

const onStateSubmitCorrect = async (states = []) => {

    const keys = ["state", "doc_status", "only_allow_edit_for"];

    return states.map(row => {
        const obj = {};
        keys.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });

};

async function httpAddNewWorkFlow(req, res) {

    try {

        const body = req.body;

        const result = WorkFlowSchema.safeParse(body);

        if (result.success) {

            const existWorkFlowForModule = await existsWorkFlowWithModuleId(result.data.module);

            if (!existWorkFlowForModule) {

                const newWorkFlow = Object.assign({}, {
                    Name: result.data.name,
                    Module: result.data.module,
                    States: await onStateSubmitCorrect(result.data.states),
                    Transition_Rules: await onTransitionSubmitCorrect(result.data.transition_rules),
                });

                const WorkFlowExists = await AddNewWorkFlow(newWorkFlow);

                if (WorkFlowExists.done === true) {
                    return res.status(200).json({ message: "WorkFlow successfully added", reason: 1, workflow: WorkFlowExists.workflow });
                }
                else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 2, workflow: null });
                }

            }
            else {

            }

        } else {

            return res.status(400).json({ message: "Required fields not specfied", reason: 3, workflow: null });
        }

    } catch (error) {
        console.log({ error })
        return res.status(400).json({ message: "Required fields not specfied", reason: 4, workflow: null });
    }

};

async function httpListWorkFlow(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllWorkFlow();

        const new_arr = await Promise.all(response.map(async (item, index) => {

            var new_obj = Object.assign({
                id: item._id,
                ...item._doc,
            });

            return new_obj;

        }));

        return res.status(200).json({ message: "WorkFlow get was successful!!", reason: 1, workflows: new_arr });


    } catch (error) {
        console.log({ error })
        return res.status(400).json({ message: "Error Please Try again", reason: 2, workflows: [] });
    }

};

async function httpGetWorkflow(req, res) {

    try {

        const { workflowId } = req.query;

        const exists_WorkFlow = await existsWorkFlowWithId(workflowId);
        if (exists_WorkFlow) {
            var new_obj = Object.assign({
                id: exists_WorkFlow._id,
                ...exists_WorkFlow._doc
            });

            return res.status(200).json({ message: "WorkFlow get was successful!!", reason: 1, workflow: new_obj });
        } else {
            return res.status(400).json({ message: "WorkFlow does not exist", reason: 2, workflow: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, workflow: null });
    }
};

async function httpEditWorkflow(req, res) {

    try {
        const body = req.body;

        const { workflowId } = req.params;

        const result = WorkFlowSchema.safeParse(body);

        if (result.success) {

            const editWorkFlow = Object.assign({}, {
                Name: result.data.name,
                Module: result.data.module,
                States: await onStateSubmitCorrect(result.data.states),
                Transition_Rules: await onTransitionSubmitCorrect(result.data.transition_rules),
            });

            const workFlowExists = await EditWorkFlowById(workflowId, editWorkFlow);

            if (workFlowExists.done === true) {
                return res.status(200).json({ message: "WorkFlow successfully edited", reason: 1, workflow: workFlowExists.workflow });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, workflow: null });
            }

        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 4, workflow: null });

        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 5, workflow: null });
    }
};

module.exports = {
    httpAddNewWorkFlow,
    httpListWorkFlow,
    httpGetWorkflow,
    httpEditWorkflow
    // httpListGroupCompany,
    // httpEditCompany
};


