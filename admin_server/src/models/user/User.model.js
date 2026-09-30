const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Userdatabase = require("./User.mongo");
const DEFAULT_USER_NUMBER = "fgsdgfgf";
const uuid = require('uuid');
const PASSWORD_HASH_SECRET = process.env.PASSWORD_HASH_SECRET;
const { createHmac } = require('crypto');

async function findUser(filter) {
    return await Userdatabase.findOne(filter, { __v: 0 })
        .populate({
            path: 'Company',
            select: { __v: 0 }
        })
        .populate({
            path: 'Roles',
            select: { __v: 0 }
        });
};

async function existsUserWithId(launchId) {
    return await findUser({
        _id: launchId,
    });
};

async function existsUserWithEmail(launchId) {
    return await findUser({
        Email: launchId,
    });
};

async function getLatestUserNumber(email) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = email;

    const latestUser = uuid.v5(name, namespace);

    // const latestUser = await Userdatabase.findOne().sort("-UserID");

    // if (!latestUser) {
    //     return DEFAULT_USER_NUMBER;
    // }

    return latestUser;
};

async function saveUser(launch) {

    const newlaunch = Object.assign({}, {
        UserID: launch.UserID,
        FirstName: launch.FirstName,
        MiddleName: launch.MiddleName,
        LastName: launch.LastName,
        Email: launch.Email,
        PasswordHash: launch.PasswordHash,
        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,


        Roles: launch.Roles,
        Allow_Modules: launch.Allow_Modules,


        IsBanned: launch.IsBanned,
        Company: launch.Company,
        PhoneNumber: launch.PhoneNumber,
    });

    const response = await Userdatabase.findOneAndUpdate(
        {
            Email: launch.Email,
        },
        newlaunch,
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

async function AddNewUser(body = null) {

    const foundemail = await existsUserWithEmail(body.Email);

    if (body !== null && !foundemail) {

        const newUserID = (await getLatestUserNumber(body.Email));
        const hash_password = await HashPassword(body.PasswordHash);

        const newLaunch = Object.assign({}, {
            UserID: newUserID,
            FirstName: body.FirstName,
            MiddleName: body.MiddleName,
            LastName: body.LastName,
            Email: body.Email,
            PasswordHash: hash_password,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
            IsActive: true,

            Roles: body.Roles !== void (0) ? body.Roles : [],
            Allow_Modules: body.Allow_Modules !== void (0) ? body.Allow_Modules : "",

            IsBanned: body.IsBanned !== void (0) ? body.IsBanned : false,
            Company: body.Company !== void (0) ? body.Company : null,
            PhoneNumber: body.PhoneNumber !== void (0) ? body.PhoneNumber : '',
        });

        const response = await saveUser(newLaunch);

        if (response) {
            return { done: true, user: response };
        }
        else {
            return { done: false, user: null };
        }

    } else {
        return { done: false, user: null };
    }

};

async function getAllUser(skip = 0, limit = 0) {
    const res = await Userdatabase
        .find({}, { __v: 0, PasswordHash: 0 })
        .populate({
            path: 'Company',
            select: { __v: 0 }
        })
        .populate({
            path: 'Roles',
            select: { __v: 0 }
        })
        .sort({ UserID: 1 })
        .skip(skip)
        .limit(limit);
    // Filter out users with UserID 'superadmin' and add Id field
    const usersWithId = res
        .filter(user => user.UserID !== 'superadmin')
        .map(user => ({ ...user.toObject(), id: user._id }));
    return usersWithId;

};

async function updateUser(UserID, User) {

    const updateUser = await Userdatabase.findOneAndUpdate(
        {
            UserID: UserID,
        },
        User,
        {
            upsert: false,
            new: true,
        }
    );
    if (updateUser) {
        return updateUser;
    } else {
        return null;
    }

};

async function EditUserById(UserID = "", body = null) {

    if (UserID !== "") {

        const User = await existsUserWithId(UserID);

        if (User) {

            if (body !== null) {
                const ModifiedDate = User.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editUser = Object.assign({}, {

                    FirstName: body.FirstName !== void (0) ? body.FirstName : User.FirstName,
                    MiddleName: body.MiddleName !== void (0) ? body.MiddleName : User.MiddleName,
                    LastName: body.LastName !== void (0) ? body.LastName : User.LastName,
                    PasswordHash: body.PasswordHash !== void (0) ? body.PasswordHash : User.PasswordHash,
                    IsActive: body.IsActive !== void (0) ? body.IsActive : User.IsActive,
                    AddedDate: User.AddedDate,
                    ModifiedDate: ModifiedDate,

                    Roles: body.Roles !== void (0) ? body.Roles : User.Roles,
                    Allow_Modules: body.Allow_Modules !== void (0) ? body.Allow_Modules : User.Allow_Modules,

                    IsBanned: body.IsBanned !== void (0) ? body.IsBanned : User.IsBanned,
                    Company: body.Company !== void (0) ? body.Company : User.Company,
                    PhoneNumber: body.PhoneNumber !== void (0) ? body.PhoneNumber : User.PhoneNumber,

                });


                const response = await updateUser(User.UserID, editUser);

                if (response) {
                    return { done: true, user: response };
                }
                else {
                    return { done: false, user: null };
                }

            } else {
                return { done: false, user: null };
            }

        }
        else {

            return { done: false, user: null };
        }

    }
    else {

        return { done: false, user: null };

    }

};

async function AbortUserById(UserID, User) {

    const aborted = await Userdatabase.deleteOne(
        {
            UserID: UserID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }


};

async function HashPassword(Password) {
    const hash_password = createHmac('sha256', PASSWORD_HASH_SECRET).update(Password).digest('hex');
    return hash_password;
}

async function EditUserPasswordById(UserID = "", body = null) {

    if (UserID !== "") {

        const User = await existsUserWithId(UserID);

        if (User) {

            if (body !== null) {
                const ModifiedDate = User.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const hash_password = await HashPassword(body.PasswordHash);


                const editUser = Object.assign({}, {

                    FirstName: User.FirstName,
                    MiddleName: User.MiddleName,
                    LastName: User.LastName,
                    PasswordHash: User.PasswordHash,
                    IsActive: User.IsActive,
                    AddedDate: User.AddedDate,
                    ModifiedDate: ModifiedDate,

                    PasswordHash: hash_password,


                    Roles: User.Roles,
                    Allow_Modules: User.Allow_Modules,

                    IsBanned: User.IsBanned,
                    Company: User.Company,
                    PhoneNumber: User.PhoneNumber,

                });

                const response = await updateUser(User.UserID, editUser);

                if (response) {
                    return { done: true, user: response };
                }
                else {
                    return { done: false, user: null };
                }

            } else {
                return { done: false, user: null };
            }

        }
        else {

            return { done: false, user: null };
        }

    }
    else {

        return { done: false, user: null };

    }

};


module.exports = {

    existsUserWithId,
    existsUserWithEmail,
    AddNewUser,
    getAllUser,
    EditUserById,
    AbortUserById,
    EditUserPasswordById

};
