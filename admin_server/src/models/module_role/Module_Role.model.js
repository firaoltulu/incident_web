const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Moduledatabase = require("./Module_Role.mongo");
const uuid = require('uuid');

async function findModule(filter) {
    return await Moduledatabase.findOne(filter);
};

async function existsModuleWithId(launchId) {
    return await findModule({
        ModuleID: launchId,
    });
};

async function getLatestModuleNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestModule = uuid.v5(name, namespace);

    return latestModule;
};

async function saveModule(launch) {

    const new_launch = Object.assign({}, {
        ModuleID: launch.ModuleID,
        Name: launch.Name,
        Description: launch.Description,
        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,

    });


    const response = await Moduledatabase.findOneAndUpdate(
        {
            ModuleID: launch.ModuleID,
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

async function AddNewModule(body = null) {

    if (body !== null) {

        const newModuleID = (await getLatestModuleNumber(new Date().toISOString()));

        const newLaunch = Object.assign({}, {
            ModuleID: newModuleID,
            Name: body.Name,
            Description: body.Description,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
            IsActive: false,

        });

        const response = await saveModule(newLaunch);

        if (response) {
            return { done: true, module: response };
        }
        else {
            return { done: false, module: null };
        }

    } else {
        return { done: false, module: null };
    }

};

async function getAllModule(skip = 0, limit = 0) {
    const res = await Moduledatabase
        .find({}, { __v: 0 })
        .sort({ ModuleID: 1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateModule(ModuleID, Module) {

    const update_module = await Moduledatabase.findOneAndUpdate(
        {
            ModuleID: ModuleID,
        },
        Module,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_module) {
        return update_module;
    } else {
        return null;
    }

};

async function EditModuleById(ModuleID = "", body = null) {

    if (ModuleID !== "") {

        const Module = await existsModuleWithId(ModuleID);

        if (Module !== null) {

            if (body !== null) {
                const ModifiedDate = Module.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editModule = Object.assign({}, {

                    Name: body.Name !== void (0) ? body.Name : Module.Name,
                    Description: body.Description !== void (0) ? body.Description : Module.Description,
                    AddedDate: Module.AddedDate,
                    ModifiedDate: ModifiedDate,
                    IsActive: body.IsActive !== void (0) ? body.IsActive : Module.IsActive,

                });

                const response = await updateModule(Module.ModuleID, editModule);

                if (response) {
                    return { done: true, module: response };
                }
                else {
                    return { done: false, module: null };
                }

            } else {
                return { done: false, module: null };
            }

        }
        else {

            return { done: false, module: null };
        }

    }
    else {

        return { done: false, module: null };

    }

};

async function AbortModuleById(ModuleID) {

    const aborted = await Moduledatabase.deleteOne(
        {
            ModuleID: ModuleID,
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

    existsModuleWithId,
    AddNewModule,
    getAllModule,
    EditModuleById,
    AbortModuleById,
};
