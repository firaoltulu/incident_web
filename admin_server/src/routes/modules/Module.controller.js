const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsModuleWithId,
    AddNewModule,
    getAllModule,
    EditModuleById,
    AbortModuleById,

} = require("../../models/module_role/Module_Role.model");

const { getPagination } = require("../../services/query");


async function httpListModule(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllModule();


        return res.status(200).json({ message: "Module get was successful!!", reason: 1, modules: response });


    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, modules: [] });
    }

};




module.exports = {
    httpListModule,
};


