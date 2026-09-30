const mongoose = require("mongoose");

const StateHistorySchema = new mongoose.Schema({
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModuleState'
    },
    date: {
        type: String,
        required: true,
    },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const AccidentSchema = new mongoose.Schema({
    AccidentID: {
        type: String,
        required: true,
    },

    // 1
    incident_date: {
        type: Date,
        required: true,
    },
    incident_time: {
        type: String,
        required: true,
        trim: true,
    },

    // 3
    // region: { type: String, required: true, trim: true },
    // zone: { type: String, required: true, trim: true },
    // city: { type: String, required: true, trim: true },
    // woreda: { type: String, required: true, trim: true },
    specific_location: { type: String, default: "" },

    // 4
    human_injury_on_person: { type: String, default: "" },
    incident_victim_count: { type: Number, default: 0 },
    property_damage_type: { type: String, default: "" },
    cash_damage_type: { type: String, default: "" },
    damaged_property_type: { type: String, default: "" },
    damaged_property_quantity: { type: String, default: "" },
    damaged_property_estimated_value: { type: Number, default: 0 },
    ip_damageToOrganizationBrand: { type: String, default: 0 },
    ip_damageToOrganizationDocumentsAndTechnologies: { type: String, default: "" },
    ip_handingOverOrganizationalPatents: { type: String, default: "" },
    ip_unauthorizedUsage: { type: String, default: 0 },
    ip_AmountofDamage: { type: String, default: "" },
    ip_damage_estimated_value: { type: Number, default: 0 },

    // 5
    accident_cause: { type: String, default: "" },
    accident_victim_injury: { type: String, default: "" },
    accident_injured_person_count: { type: Number, default: 0 },
    accident_property_damage_quantity: { type: String, default: "" },
    accident_property_damage_estimated_value: { type: Number, default: 0 },
    accident_ip_damage_type: { type: String, default: "" },
    accident_ip_damage_estimated_value: { type: Number, default: 0 },

    // 6-12
    incident_summary: { type: String, required: true },
    perpetrator_type: { type: String,default: ""},
    // perpetrator_type: { type: String, required: true },
    administrative_action_taken: { type: String, default: "" },
    no_action_reason: { type: String, default: "" },
    suspects_in_custody_count: { type: Number, default: 0 },
    suspects_escaped_count: { type: Number, default: 0 },
    suspect_unidentified: { type: String, default: "" },
    follow_up_monitoring_case: { type: String, default: "" },
    additional_comments: { type: String, default: "" },
    reporter_name: { type: String, required: true, trim: true },
    // reporter_signature: { type: String, default: "" },
    report_date: {
        type: Date,
        required: true,
    },
    incident_type: {
       type: String,
       required: true,
        
    },

    //  by server
    AddedDate: { type: String, required: true },
    ModifiedDate: { type: [String], required: true },
    IsActive: { type: Boolean, required: true },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModuleState'
    },
    stateHistory: {
        type: [StateHistorySchema],
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
});

module.exports = mongoose.model("Accident", AccidentSchema);

// const mongoose = require("mongoose");    
// // import mongoose from "mongoose";

// const StateHistorySchema = new mongoose.Schema({
//     state: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'ModuleState'
//     },
//     date: {
//         type: String,
//         required: true,
//     },
//     by: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'

//     },
// });

// const AccidentSchema = new mongoose.Schema({

//     AccidentID: {
//         type: String,
//         required: true,
//     },

//     date_of_report: {
//         type: Date,
//         required: true,
//     },

//     region: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     zone: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     worda: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     town: {
//         type: String,
//         required: true,
//         trim: true,
//     },

//     specificArea: {
//         type: String,
//         default: "",
//     },

//     type_of_incident: {
//         type: String,
//         required: true,
//     },

//     categories_of_incident: {
//         type: String,
//         required: true,
//     },

//     damage_inflicted: {
//         type: String,
//         required: true,
//     },

//     damage_occurred_to_person: {
//         type: String,
//         required: true,
//     },

//     numberOfDeaths: {
//         type: Number,
//         default: 0,
//     },

//     numberOfInjured: {
//         type: Number,
//         default: 0,
//     },

//     numberOfNoneVictims: {
//         type: Number,
//         default: 0,
//     },

//     estimatedPropertyDamage: {
//         type: Number,
//         default: 0,
//     },

//     amountOfFinancialLoss: {
//         type: Number,
//         default: 0,
//     },

//     damageToOrganizationBrand: {
//         type: String,
//         default: "",
//     },

//     description: {
//         type: String,
//         required: true,
//     },

//     actionTaken: {
//         type: String,
//         required: true,
//     },

//     actionExecutedByInternalStaff: {
//         type: String,
//         default: "",
//     },

//     actionExecutedByOutsidePerson: {
//         type: String,
//         default: "",
//     },

//     numberOfArrestedSuspects: {
//         type: Number,
//         default: 0,
//     },

//     numberOfEscapedSuspects: {
//         type: Number,
//         default: 0,
//     },

//     mainCauseOfIncident: {
//         type: String,
//         required: true,
//     },

//     statusOfCase: {
//         type: String,
//         required: true,
//     },

//     typeOfSupportExpected: {
//         type: String,
//         required: true,
//     },


//     AddedDate: {
//         type: String,
//         required: true,
//     },
//     ModifiedDate: {
//         type: [String],
//         required: true,
//     },
//     IsActive: {
//         type: Boolean,
//         required: true,
//     },

//     ///////////////////////////User Level
//     state: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'ModuleState'

//     },

//     stateHistory: {
//         type: [StateHistorySchema],
//     },

//     company: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Company'
//     }

// });

// module.exports = mongoose.model("Accident", AccidentSchema);