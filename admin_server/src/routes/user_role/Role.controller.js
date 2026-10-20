const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsRoleWithId,
    AddNewRole,
    getAllRole,
    EditRoleById,
    AbortRoleById,

} = require("../../models/user_role/User_Role.model");

const {
    getAllModule,
} = require("../../models/module_role/Module_Role.model");

const { getPagination } = require("../../services/query");

const { NewRoleSchema } = require("../../schema/RoleSchema");

const ADMINISTRATOR_ROLE_ID = process.env.USER_ROLE_ADMIN;

function extractModuleValues(modules) {
    return modules.map(module => module.value);
}

async function httpAddNewRole(req, res) {

    try {

        const body = req.body;

        const result = NewRoleSchema.safeParse(body);

        if (result.success) {

            const data = result.data;

            const newRole = Object.assign({}, {
                Name: data.name,
                Description: data.description,
                IsActive: data.isActive.enabled,
                Modules: extractModuleValues(data.modules),
            });

            const roleExists = await AddNewRole(newRole);

            if (roleExists.done === true) {
                return res.status(200).json({ message: "Role successfully added", reason: 2, role: roleExists.role });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 3, role: null });
            }

        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 4, role: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 5, role: null });
    }

};

async function httpListRoles(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllRole();

        return res.status(200).json({ message: "Roles get was successful!!", reason: 1, roles: response });

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, roles: [] });
    }

};

async function httpGetRole(req, res) {

    try {


        const { roleId } = req.query;

        const exists_Role = await existsRoleWithId(roleId);

        if (exists_Role) {
            var new_obj = Object.assign({
                id: exists_Role._id,
                ...exists_Role._doc
            });

            return res.status(200).json({ message: "Role get was successful!!", reason: 1, role: new_obj });
        } else {
            return res.status(400).json({ message: "Company does not exist", reason: 2, role: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, role: null });
    }
};

async function httpEditRole(req, res) {

    try {
        const body = req.body;

        const { roleId } = req.params;

        if (roleId === ADMINISTRATOR_ROLE_ID) {
            return res.status(403).json({
                message: "The Administrator role cannot be edited",
                role: null,
            });
        }

        const result = NewRoleSchema.safeParse(body);

        if (result.success) {

            const data = result.data;

            const editRole = Object.assign({}, {
                Name: data.name,
                Description: data.description,
                IsActive: data.isActive.enabled,
                Modules: extractModuleValues(data.modules),
            });

            const roleExists = await EditRoleById(roleId, editRole);

            if (roleExists.done === true) {
                return res.status(200).json({ message: "role successfully edited", reason: 1, role: roleExists.role });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, role: null });
            }

        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 3, role: null });

        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, role: null });
    }
};

async function httpDeleteRole(req, res) {
    try {
        const userRoles = Array.isArray(req.user?.Roles) ? req.user.Roles : [];
        const isAdmin = userRoles.some(
            (role) => String(role?._id || role?.id || role) === ADMINISTRATOR_ROLE_ID
        );

        if (!isAdmin) {
            return res.status(403).json({
                message: "Only administrators can delete roles",
                reason: 6,
            });
        }

        const { roleId } = req.params;

        if (!roleId) {
            return res.status(400).json({ message: "Role ID is required", reason: 1 });
        }

        const result = await AbortRoleById(roleId);

        if (result.done) {
            return res.status(200).json({ message: "Role successfully deleted", reason: 1 });
        }

        if (result.notFound) {
            return res.status(404).json({ message: "Role does not exist", reason: 2 });
        }

        return res.status(409).json({
            message: `Cannot delete this role because it is associated with ${result.associatedWith.join(", ")}`,
            reason: 3,
        });
    } catch (error) {
        console.error("Failed to delete role:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid role ID", reason: 4 });
        }
        return res.status(500).json({ message: "Failed to delete role", reason: 5 });
    }
};

// async function httpListGroupCompany(req, res) {

//     try {

//         const body = req.body;

//         // const { index, step } = req.query;
//         // const pagination = getPagination({ page: index, limit: step });

//         const response = await getAllCompany();

//         var new_arr = response.filter((item) => {

//             if (item.IsGroup === true) {
//                 var new_obj = Object.assign({
//                     id: item.CompanyID,
//                     ...item._doc
//                 });
//                 return new_obj;
//             }

//         })

//         if (response) {
//             return res.status(200).json({ message: "Company get was successful!!", reason: 1, companies: new_arr });
//         } else {
//             return res.status(400).json({ message: "Error Please Try again", reason: 2, companies: [] });
//         }

//     } catch (error) {
//         return res.status(400).json({ message: "Error Please Try again", reason: 3, companies: [] });
//     }

// };


module.exports = {
    httpAddNewRole,
    httpListRoles,
    httpGetRole,
    httpEditRole,
    httpDeleteRole
    // httpListGroupCompany,
    // httpGetCompany,
    // httpEditCompany
};
