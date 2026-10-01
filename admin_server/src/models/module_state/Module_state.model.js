const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ModuleStatedatabase = require("./Module_state.mongo");
const uuid = require('uuid');

async function findModuleState(filter) {
    return await ModuleStatedatabase.findOne(filter);
};

async function existsModuleStateWithId(launchId) {
    return await findModuleState({
        StateID: launchId,
    });
};


async function getLatestModuleStateNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestModuleState = uuid.v5(name, namespace);

    return latestModuleState;
};

async function saveModuleState(launch) {

    const new_launch = Object.assign({}, {
        StateID: launch.StateID,
        Name: launch.Name,
        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
    });


    const response = await ModuleStatedatabase.findOneAndUpdate(
        {
            StateID: launch.StateID,
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

async function AddNewModuleState(body = null) {

    if (body !== null) {

        const newStateID = (await getLatestModuleStateNumber(new Date().toISOString()));

        const newLaunch = Object.assign({}, {
            StateID: newStateID,
            Name: body.Name,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
        });

        const response = await saveModuleState(newLaunch);

        if (response) {
            return { done: true, state: response };
        }
        else {
            return { done: false, state: null };
        }

    } else {
        return { done: false, state: null };
    }

};

async function getAllModuleState(skip = 0, limit = 0) {
    const res = await ModuleStatedatabase
        .find({}, { __v: 0 })
        .sort({ StateID: 1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateModuleState(StateID, ModuleState) {

    const update_module_state = await ModuleStatedatabase.findOneAndUpdate(
        {
            StateID: StateID,
        },
        ModuleState,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_module_state) {
        return update_module_state;
    } else {
        return null;
    }

};

async function EditModuleStateById(StateID = "", body = null) {

    if (StateID !== "") {

        const ModuleState = await existsModuleStateWithId(StateID);

        if (ModuleState !== null) {

            if (body !== null) {
                const ModifiedDate = ModuleState.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editModuleState = Object.assign({}, {
                    Name: body.Name !== void (0) ? body.Name : ModuleState.Name,
                    AddedDate: ModuleState.AddedDate,
                    ModifiedDate: ModifiedDate,
                });

                const response = await updateModuleState(ModuleState.StateID, editModuleState);

                if (response) {
                    return { done: true, moduleState: response };
                }
                else {
                    return { done: false, moduleState: null };
                }

            } else {
                return { done: false, moduleState: null };
            }

        }
        else {
            return { done: false, moduleState: null };
        }

    }
    else {
        return { done: false, moduleState: null };
    }

};

async function AbortModuleStateById(StateID) {

    const aborted = await ModuleStatedatabase.deleteOne(
        {
            StateID: StateID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }

};

module.exports = {

    existsModuleStateWithId,
    AddNewModuleState,
    getAllModuleState,
    EditModuleStateById,
    AbortModuleStateById,


};
