const mongoose = require("mongoose");

const ButtonSchema = new mongoose.Schema({

    ButtonID: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Color: {
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

module.exports = mongoose.model("Button", ButtonSchema);