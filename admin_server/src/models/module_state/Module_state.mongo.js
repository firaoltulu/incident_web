const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({

    StateID: {
        type: String,
        required: true,
    },
    Name: {
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

});

module.exports = mongoose.model("ModuleState", StateSchema);