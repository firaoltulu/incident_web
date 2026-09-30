const axios = require("axios");
const fs = require("fs");
const path = require("path");
const User_Roledatabase = require("./User_Role.mongo");
const uuid = require('uuid');

async function findRole(filter) {
    return await User_Roledatabase.findOne(filter)
        .populate({
            path: 'Modules',
            select: { __v: 0 }
        });
};

async function existsRoleWithId(launchId) {
    return await findRole({
        _id: launchId,
    });
};

async function getLatestRoleNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestRole = uuid.v5(name, namespace);

    return latestRole;
};

async function saveRole(launch) {

    const new_launch = Object.assign({}, {
        RoleID: launch.RoleID,
        Name: launch.Name,
        Description: launch.Description,
        Modules: launch.Modules,
        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,

    });


    const response = await User_Roledatabase.findOneAndUpdate(
        {
            RoleID: launch.RoleID,
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

async function AddNewRole(body = null) {

    if (body !== null) {

        const newRoleID = (await getLatestRoleNumber(new Date().toISOString()));

        const newLaunch = Object.assign({}, {
            RoleID: newRoleID,
            Name: body.Name,
            Description: body.Description,
            Modules: body.Modules,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
            IsActive: body.IsActive,

        });

        console.log({ newLaunch });

        const response = await saveRole(newLaunch);

        if (response) {
            return { done: true, role: response };
        }
        else {
            return { done: false, role: null };
        }

    } else {
        return { done: false, role: null };
    }

};

async function getAllRole(skip = 0, limit = 0) {
    const res = await User_Roledatabase
        .find({}, { __v: 0 })
        .populate({
            path: 'Modules',
            select: { __v: 0 }
        })
        .sort({ AddedDate: 1 })
        .skip(skip)
        .limit(limit);

    const rolesWithId = res.map(role => ({ ...role.toObject(), id: role._id }));
    return rolesWithId;

};

async function updateRole(RoleID, Role) {

    const update_role = await User_Roledatabase.findOneAndUpdate(
        {
            _id: RoleID,
        },
        Role,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_role) {
        return update_role;
    } else {
        return null;
    }

};

async function EditRoleById(RoleID = "", body = null) {

    if (RoleID !== "") {

        const Role = await existsRoleWithId(RoleID);

        if (Role !== null) {

            if (body !== null) {
                const ModifiedDate = Role.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editRole = Object.assign({}, {

                    Name: body.Name !== void (0) ? body.Name : Role.Name,
                    Description: body.Description !== void (0) ? body.Description : Role.Description,
                    Modules: body.Modules !== void (0) ? body.Modules : Role.Modules,
                    AddedDate: Role.AddedDate,
                    ModifiedDate: ModifiedDate,
                    IsActive: body.IsActive !== void (0) ? body.IsActive : Role.IsActive,

                });

                const response = await updateRole(RoleID, editRole);

                if (response) {
                    return { done: true, role: response };
                }
                else {
                    return { done: false, role: null };
                }

            } else {
                return { done: false, role: null };
            }

        }
        else {

            return { done: false, role: null };
        }

    }
    else {

        return { done: false, role: null };

    }

};

async function AbortRoleById(RoleID) {

    const aborted = await User_Roledatabase.deleteOne(
        {
            RoleID: RoleID,
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

    existsRoleWithId,
    AddNewRole,
    getAllRole,
    EditRoleById,
    AbortRoleById,
};
