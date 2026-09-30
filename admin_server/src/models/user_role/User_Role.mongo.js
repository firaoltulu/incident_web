const mongoose = require("mongoose");


const RoleSchema = new mongoose.Schema({

    RoleID: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Modules: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Module',
        // type: [ModuleSchema],
        // required: true,
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

module.exports = mongoose.model("User_Role", RoleSchema);