const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsUserWithId,
    existsUserWithEmail,
    AddNewUser,
    getAllUser,
    EditUserById,
    AbortUserById,
    EditUserPasswordById
} = require("../../models/user/User.model");

const {
    createsign,
    verifySign,
    checkPassword
} = require("../../services/jwt");

const {
    existsCompanyWithId,
} = require("../../models/company/Company.model");

const { NewUserSchema } = require("../../schema/NewUserSchema");


async function httpLoginAuthorization(req, res) {

    try {

        const body = req.body;

        const { email, password } = body;

        if (email != "" && password != "") {

            const found_email = await existsUserWithEmail(email);

            if (found_email.IsActive) {

                const pass_correct = await checkPassword(password, found_email.PasswordHash);

                if (pass_correct) {

                    const { token, user } = await createsign(found_email);

                    return res.status(201).json({ message: "User Login successfully!!", reason: 1, user: user, accessToken: token });
                }
                else {

                    return res.status(400).json({ message: "User Login failed!!", reason: 2, user: null, accessToken: "" });

                }

            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 3, user: null, accessToken: "" });

            }

        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 4, user: null, accessToken: "" });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 5, user: null, accessToken: "" });
    }

};

async function httpMy_accountAuthorization(req, res) {
    try {
        const body = req.body;

        const token = req.headers?.authorization;
        // console.log(token);
        // console.log("hello");
        // const token = req.headers ? req.headers?.cookies : null;
        const didToken = token ? token.substr(7) : "";

        const { user } = await verifySign(didToken);

        if (user !== null) {
            return res.status(201).json({ message: "login successfully!!", reason: 1, user: user });
        }
        else {
            return res.status(401).json({ message: "login was not successful!!", reason: 2, user: null });

        }

    } catch (error) {
        return res.status(401).json({ message: "login was not successful!!", reason: 3, user: null });

    }
};

async function httpRegisterNewAccountAuthorization(req, res) {
    try {
        const body = req.body;

        const token = req.headers?.authorization;

        // const token = req.headers ? req.headers?.cookies : null;
        const didToken = token ? token.substr(7) : "";

        const { user } = await verifySign(didToken);

        if (user !== null) {

            const result = NewUserSchema.safeParse(body);

            if (result.success) {


                const { firstName, middleName, lastName, userEmail, phoneNumber, company, defaultPassword } = result.data;

                const exists_email = await existsUserWithEmail(userEmail);

                if (!exists_email) {

                    const newobject = Object.assign({}, {
                        FirstName: firstName,
                        MiddleName: middleName,
                        LastName: lastName,
                        Email: userEmail,
                        PhoneNumber: phoneNumber,
                        Company: company,
                        PasswordHash: defaultPassword
                    });

                    const response = await AddNewUser(newobject);

                    if (response.done) {
                        return res.status(201).json({ message: "Register successfully!!", reason: 1, user: response.user });
                    } else {
                        return res.status(401).json({ message: "Register was not successful!!", reason: 2, user: null });
                    }

                } else {
                    return res.status(401).json({ message: "User With Same Email Exists was not successful!!", reason: 3, user: null });
                }

            } else {
                return res.status(401).json({ message: "User With Same Email Exists was not successful!!", reason: 3, user: null });
            }

        }
        else {
            return res.status(401).json({ message: "Register was not successful!!", reason: 4, user: null });

        }

    } catch (error) {
        return res.status(401).json({ message: "Register was not successful!!", reason: 5, user: null });

    }
};

async function httpListUsersAuthorization(req, res) {
    try {
        const body = req.body;

        const token = req.headers?.authorization;

        // const token = req.headers ? req.headers?.cookies : null;
        const didToken = token ? token.substr(7) : "";

        const { user } = await verifySign(didToken);

        if (user !== null) {
            const users = await getAllUser();

            return res.status(201).json({ message: "List users successfully!!", reason: 1, users: users });
        }
        else {
            return res.status(401).json({ message: "login was not successful!!", reason: 2, users: [] });

        }

    } catch (error) {
        return res.status(401).json({ message: "login was not successful!!", reason: 3, users: [] });

    }
};

async function httpGetUserAuthorization(req, res) {

    try {

        const { userId } = req.query;

        const exists_User = await existsUserWithId(userId);
        if (exists_User) {
            var new_obj = Object.assign({
                id: exists_User._id,
                ...exists_User._doc
            });

            return res.status(200).json({ message: "User get was successful!!", reason: 1, user: new_obj });
        } else {
            return res.status(400).json({ message: "User does not exist", reason: 2, user: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, user: null });
    }
};

function extractRoleValues(roles) {
    return roles.map(role => role.value);
}

async function httpEditUserAuthorization(req, res) {

    try {
        const body = req.body;

        const { userId } = req.params;

        if (userId != "" && body.FirstName != "" && body.LastName != "" && body.Email != "" && body.PhoneNumber != "" && body.Company != "") {


            const editUser = Object.assign({}, {
                FirstName: body.firstName,
                MiddleName: body.middleName,
                LastName: body.lastName,
                Email: body.email,
                PhoneNumber: body.phoneNumber,
                Company: body.company,
                Roles: extractRoleValues(body.roles),
                IsBanned: body?.isBanned !== void (0) ? body.isBanned : false,
                IsActive: body?.isActive !== void (0) ? body.isActive : true,
            });

            const userExists = await EditUserById(userId, editUser);

            if (userExists.done === true) {
                return res.status(200).json({ message: "User successfully edited", reason: 1, user: userExists.user });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, user: null });
            }
        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 3, user: null });

        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, user: null });
    }
};

async function httpChangePasswordAuthorization(req, res) {

    try {
        const body = req.body;

        const { userId } = req.params;

        if (userId != "" && body.newPassword != "") {


            const editUser = Object.assign({}, {
                PasswordHash: body.newPassword,
                IsBanned: body?.isBanned !== void (0) ? body.isBanned : false,
                IsActive: body?.isActive !== void (0) ? body.isActive : true,
            });

            const userExists = await EditUserPasswordById(userId, editUser);

            if (userExists.done === true) {
                return res.status(200).json({ message: "User successfully edited", reason: 1, user: userExists.user });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, user: null });
            }
        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 3, user: null });

        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, user: null });
    }
};

async function httpActiveAuthorization(req, res) {

    try {
        const body = req.body;

        const { userId } = req.params;

        if (userId != "") {

            const User = await existsUserWithId(userId);

            const editUser = Object.assign({}, {
                IsActive: !User?.IsActive,
            });

            const userExists = await EditUserById(userId, editUser);

            if (userExists.done === true) {
                return res.status(200).json({ message: "User successfully edited", reason: 1, user: userExists.user });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, user: null });
            }
        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 3, user: null });

        }

    } catch (error) {
        console.log({ error });
        return res.status(400).json({ message: "Error Please Try again", reason: 3, user: null });
    }
};




module.exports = {

    httpLoginAuthorization,
    httpMy_accountAuthorization,
    httpRegisterNewAccountAuthorization,
    httpListUsersAuthorization,
    httpGetUserAuthorization,
    httpEditUserAuthorization,
    httpChangePasswordAuthorization,
    httpActiveAuthorization

};


