const axios = require("axios");
const fs = require("fs");
const path = require("path");
const WorkFlowdatabase = require("./WorkFlow.mongo");
const uuid = require('uuid');

async function findWorkFlow(filter) {
    return await WorkFlowdatabase.findOne(filter)
        .populate({
            path: 'Module',
            select: { __v: 0 }
        })
        .populate({
            path: 'States.state',
            select: { __v: 0 }
        })
        .populate({
            path: 'States.only_allow_edit_for',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.state',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.action',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.next_state',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.allowed',
            select: { __v: 0 }
        })

};

async function existsWorkFlowWithId(launchId) {
    return await findWorkFlow({
        _id: launchId,
    });
};

async function getLatestWorkFlowNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestWorkFlow = uuid.v5(name, namespace);

    return latestWorkFlow;
};

async function saveWorkFlow(launch) {

    const new_launch = Object.assign({}, {
        WorkFlowID: launch.WorkFlowID,
        Name: launch.Name,
        Module: launch.Module,
        States: launch.States,
        Transition_Rules: launch.Transition_Rules,

        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,

    });


    const response = await WorkFlowdatabase.findOneAndUpdate(
        {
            WorkFlowID: launch.WorkFlowID,
        },
        new_launch,
        {
            new: true,
            upsert: true,
        }
    );

    if (response) {
        return response;
    } else {
        return null;
    }
};

async function AddNewWorkFlow(body = null) {

    if (body !== null) {

        const newWorkFlowID = (await getLatestWorkFlowNumber(new Date().toISOString()));

        const newLaunch = Object.assign({}, {
            WorkFlowID: newWorkFlowID,
            Name: body.Name,
            Module: body.Module,
            States: body.States,
            Transition_Rules: body.Transition_Rules,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
            IsActive: true,

        });

        const response = await saveWorkFlow(newLaunch);

        if (response) {
            return { done: true, workflow: response };
        }
        else {
            return { done: false, workflow: null };
        }

    } else {
        return { done: false, workflow: null };
    }

};

async function getAllWorkFlow(skip = 0, limit = 0) {
    const res = await WorkFlowdatabase
        .find({}, { __v: 0 })
        .populate({
            path: 'Module',
            select: { __v: 0 }
        })
        .populate({
            path: 'States.state',
            select: { __v: 0 }
        })
        .populate({
            path: 'States.only_allow_edit_for',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.state',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.action',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.next_state',
            select: { __v: 0 }
        })
        .populate({
            path: 'Transition_Rules.allowed',
            select: { __v: 0 }
        })
        .sort({ WorkFlowID: 1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateWorkFlow(WorkFlowID, WorkFlow) {

    const update_workflow = await WorkFlowdatabase.findOneAndUpdate(
        {
            _id: WorkFlowID,
        },
        WorkFlow,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_workflow) {
        return update_workflow;
    } else {
        return null;
    }

};

async function EditWorkFlowById(WorkFlowID = "", body = null) {

    if (WorkFlowID !== "") {

        const WorkFlow = await existsWorkFlowWithId(WorkFlowID);

        if (WorkFlow !== null) {

            if (body !== null) {
                const ModifiedDate = WorkFlow.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editWorkFlow = Object.assign({}, {

                    Name: body.Name !== void (0) ? body.Name : WorkFlow.Name,
                    Module: body.Module !== void (0) ? body.Module : WorkFlow.Module,
                    States: body.States !== void (0) ? body.States : WorkFlow.States,
                    Transition_Rules: body.Transition_Rules !== void (0) ? body.Transition_Rules : WorkFlow.Transition_Rules,
                    AddedDate: WorkFlow.AddedDate,
                    ModifiedDate: ModifiedDate,
                    IsActive: body.IsActive !== void (0) ? body.IsActive : WorkFlow.IsActive,

                });

                const response = await updateWorkFlow(WorkFlow._id, editWorkFlow);

                if (response) {
                    return { done: true, workflow: response };
                }
                else {
                    return { done: false, workflow: null };
                }

            } else {
                return { done: false, workflow: null };
            }

        }
        else {

            return { done: false, workflow: null };
        }

    }
    else {

        return { done: false, workflow: null };

    }

};

async function AbortWorkFlowById(WorkFlowID) {

    const aborted = await WorkFlowdatabase.deleteOne(
        {
            WorkFlowID: WorkFlowID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }

};

async function existsWorkFlowWithModuleId(moduleId) {
    return await findWorkFlow({
        Module: moduleId,
    });
};


module.exports = {

    existsWorkFlowWithId,
    AddNewWorkFlow,
    getAllWorkFlow,
    EditWorkFlowById,
    AbortWorkFlowById,
    existsWorkFlowWithModuleId
};
