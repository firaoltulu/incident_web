const mongoose = require("mongoose");

const ServiceProvidedSchema = new mongoose.Schema({
    SID: {
        type: String,
        required: true,
    },
    Type_of_service: {
        type: String,
        required: true,
    },
    Model: {
        type: String,
        required: true,
    },
    Qty: {
        type: Number,
        required: true,
    },
    Remarks: {
        type: String,
        required: true,
    },
});

const OrderSchema = new mongoose.Schema({

    OrderID: {
        type: String,
        required: true,
    },
    Received_By: {
        type: [String],
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
    Company: {
        type: String,
        required: true,
    },
    Department: {
        type: String,
        required: true,
    },

    Branch: {
        type: String,
        required: true,
    },
    ServiceParentGroup: {
        type: String,
        required: true,
    },
    Service: {
        type: String,
        required: true,
    },
    Machine_Fault: {
        type: String,
        required: true,
    },
    Solution_provided: {
        type: String,
        required: true,
    },
    Reason: {
        type: String,
        required: true,
    },
    Recommendation: {
        type: String,
        required: true,
    },
    Service_provided: {
        type: [ServiceProvidedSchema],
    },
    Status: {
        type: Number,
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

module.exports = mongoose.model("Order", OrderSchema);