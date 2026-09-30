const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({

    CompanyID: {
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

    },
    ModifiedDate: {
        type: [String],
        required: true,
    },
    IsActive: {
        type: Boolean,
        required: true,
    },
    IsGroup: {
        type: Boolean,
        required: true,
    },
    ParentGroup: {
        type: String,
        required: true,
        // type: [mongoose.Schema.Types.ObjectId],
        // required: 'Company',
    },

    ///////////////////////////User Level
    IsBanned: {
        type: Boolean,
    },

});

module.exports = mongoose.model("Company", CompanySchema);