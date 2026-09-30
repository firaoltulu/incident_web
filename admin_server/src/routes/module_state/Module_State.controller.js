const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsModuleStateWithId,
    AddNewModuleState,
    getAllModuleState,
    EditModuleStateById,
    AbortModuleStateById,

} = require("../../models/module_state/Module_State.model");

const { getPagination } = require("../../services/query");



async function httpListModuleState(req, res) {

    try {

        const body = req.body;

        // const { index, step } = req.query;
        // const pagination = getPagination({ page: index, limit: step });

        const response = await getAllModuleState();

        return res.status(200).json({ message: "Module State get was successful!!", reason: 1, moduleStates: response });

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, moduleStates: [] });
    }

};



module.exports = {
    httpListModuleState,
};


