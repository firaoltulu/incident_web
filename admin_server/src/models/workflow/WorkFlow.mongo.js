const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
    state: {
        // type: String,
        // required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModuleState',
    },
    doc_status: {
        type: Number,
        required: true,
    },
    only_allow_edit_for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Role',
    },
});

const Transition_RulesSchema = new mongoose.Schema({
    state: {
        // type: String,
        // required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModuleState',
    },
    action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Button',
    },
    next_state: {
        // type: String,
        // required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModuleState',
    },
    allowed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User_Role',
    },
});


const WorkFlowSchema = new mongoose.Schema({

    WorkFlowID: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        // type: String,
        // required: true,
    },
    States: {
        type: [StateSchema],
        required: true,
    },
    Transition_Rules: {
        type: [Transition_RulesSchema],
        required: true,
    },
    AddedDate: {
        type: String,
        required: true,
    },
    ModifiedDate: {
        type: [String],
        required: true,
    },
    IsActive: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model("WorkFlow", WorkFlowSchema);