const mongoose = require("mongoose");


const ModuleSchema = new mongoose.Schema({

    ModuleID: {
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

module.exports = mongoose.model("Module", ModuleSchema);