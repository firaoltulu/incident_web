const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsCompanyWithId,
    AddNewCompany,
    getAllCompany,
    EditCompanyById,
    AbortCompanyById,
    existsCompanyWithCompanyId

} = require("../../models/company/Company.model");

const { getPagination } = require("../../services/query");


async function httpAddNewCompany(req, res) {

    try {

        const body = req.body;

        if (body.name != "" && body.description != "") {

            const exists_Company = await existsCompanyWithId(body.parentGroup);

            if (exists_Company && exists_Company.IsGroup === true) {

                const newCompany = Object.assign({}, {
                    Name: body.name,
                    Description: body.description,
                    IsActive: true,
                    IsGroup: body.isGroup.enabled,
                    ParentGroup: body.parentGroup,
                    IsBanned: false,
                });

                const companyExists = await AddNewCompany(newCompany);

                if (companyExists.done === true) {
                    return res.status(200).json({ message: "Company successfully added", reason: 1 });
                }
                else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 2 });
                }

            }
            else {
                return res.status(400).json({ message: "Parent Group does not exist", reason: 3 });
            }


        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 4 });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 5 });
    }

};

async function httpListCompany(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllCompany();

        const new_arr = await Promise.all(response.map(async (item, index) => {

            if (item.ParentGroup === "") {
                var new_obj_parent = Object.assign({
                    parentId: "",
                    parentLabel: "",
                });

                var new_obj = Object.assign({
                    id: item._id,
                    ...item._doc,
                    ParentGroup: new_obj_parent,
                });
                return new_obj;

            }
            else {
                const exists_Company = await existsCompanyWithCompanyId(item.ParentGroup);

                var new_obj_parent = Object.assign({
                    parentId: exists_Company._id,
                    parentLabel: exists_Company.Name,
                });

                var new_obj = Object.assign({
                    id: item._id,
                    ...item._doc,
                    ParentGroup: new_obj_parent,
                });

                return new_obj;

            }

        }));

        return res.status(200).json({ message: "Company get was successful!!", reason: 1, companies: new_arr });

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, companies: [] });
    }

};

async function httpListGroupCompany(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllCompany();

        var new_arr = response.filter((item) => {

            if (item.IsGroup === true) {
                var new_obj = Object.assign({
                    id: item.CompanyID,
                    ...item._doc
                });
                return new_obj;
            }

        })

        if (response) {
            return res.status(200).json({ message: "Company get was successful!!", reason: 1, companies: new_arr });
        } else {
            return res.status(400).json({ message: "Error Please Try again", reason: 2, companies: [] });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, companies: [] });
    }

};

async function httpGetCompany(req, res) {

    try {

        const { companyId } = req.query;

        console.log({ companyId })

        const exists_Company = await existsCompanyWithId(companyId);
        if (exists_Company) {
            var new_obj = Object.assign({
                id: exists_Company.CompanyID,
                ...exists_Company._doc
            });

            return res.status(200).json({ message: "Company get was successful!!", reason: 1, company: new_obj });
        } else {
            return res.status(400).json({ message: "Company does not exist", reason: 2, company: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, company: null });
    }
};

async function httpEditCompany(req, res) {

    try {
        const body = req.body;

        const { companyId } = req.params;

        if (body.name != "" && body.description != "" && companyId != "") {

            const editCompany = Object.assign({}, {
                Name: body.name,
                Description: body.description,
                IsActive: body?.isActive !== void (0) ? body.isActive : true,
                IsGroup: body.isGroup.enabled,
                ParentGroup: body.parentGroup,
                IsBanned: body?.isBanned !== void (0) ? body.isBanned : false,
            });

            const companyExists = await EditCompanyById(companyId, editCompany);

            if (companyExists.done === true) {
                return res.status(200).json({ message: "Company successfully edited", reason: 1, company: companyExists.company });
            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 2, company: null });
            }

        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 3, company: null });

        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, company: null });
    }
};

module.exports = {
    httpAddNewCompany,
    httpListCompany,
    httpListGroupCompany,
    httpGetCompany,
    httpEditCompany
};


