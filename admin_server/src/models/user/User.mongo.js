const mongoose = require("mongoose");


const Allow_ModulesSchema = new mongoose.Schema({
    ModuleID: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true,
    },
});

const UserSchema = new mongoose.Schema({
    UserID: {
        type: String,
        required: true,
    },
    FirstName: {
        type: String,
        required: true,
    },
    MiddleName: {
        type: String,
        required: true,
    },
    LastName: {
        type: String,
        required: true,
    },
    Email: {
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
    },
    PasswordHash: {
        type: String,
        required: true,
    },

    ///////////////////////////User Level
    Roles: {
        // type: [RoleSchema],
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User_Role',
    },
    Allow_Modules: {
        type: String,
    },
    IsBanned: {
        type: Boolean,
    },
    Company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    PhoneNumber: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model("User", UserSchema);