const Accidentdatabase = require("./Accident.mongo");
const uuid = require('uuid');

const ACCIDENT_DATA_FIELDS = [
    'incident_date', 'incident_time',
    // 'region', 'zone', 'city', 'woreda',
     'specific_location',
    'human_injury_on_person', 'incident_victim_count',
    'property_damage_type', 'cash_damage_type',
    'damaged_property_type', 'damaged_property_quantity', 'damaged_property_estimated_value',
    'ip_damageToOrganizationBrand', 'ip_damageToOrganizationDocumentsAndTechnologies',
    'ip_handingOverOrganizationalPatents', 'ip_unauthorizedUsage',
    'ip_AmountofDamage', 'ip_damage_estimated_value',
    'accident_cause', 'accident_victim_injury', 'accident_injured_person_count',
    'accident_property_damage_quantity', 'accident_property_damage_estimated_value',
    'accident_ip_damage_type', 'accident_ip_damage_estimated_value',
    'incident_summary', 'perpetrator_type',
    'administrative_action_taken', 'no_action_reason',
    'suspects_in_custody_count', 'suspects_escaped_count', 'suspect_unidentified',
    'follow_up_monitoring_case', 'additional_comments',
    'reporter_name', 'reporter_signature', 'report_date','incident_type',
];

function pickAccidentFields(source) {
    const out = {};
    for (const key of ACCIDENT_DATA_FIELDS) {
        if (source[key] !== undefined) {
            out[key] = source[key];
        }
    }
    return out;
}

function mergeAccidentFields(existing, body) {
    const out = pickAccidentFields(existing);
    for (const key of ACCIDENT_DATA_FIELDS) {
        if (body[key] !== void (0)) {
            out[key] = body[key];
        }
    }
    return out;
}

async function findAccident(filter) {
    return await Accidentdatabase.findOne(filter)
        .populate({
            path: 'company',
            select: { __v: 0 }
        })
        .populate({
            path: 'state',
            select: { __v: 0 }
        })
        .populate({
            path: 'stateHistory.state',
            select: { __v: 0 }
        })
        .populate({
            path: 'stateHistory.by',
            select: { __v: 0, PasswordHash: 0 }
        });
}

async function existsAccidentWithId(launchId) {
    return await findAccident({
        _id: launchId,
    });
}

async function getLatestAccidentNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9');
    const name = index;
    return uuid.v5(name, namespace);
}

async function saveAccident(launch) {
    const new_launch = {
        AccidentID: launch.AccidentID,
        ...pickAccidentFields(launch),
        AddedDate: launch.AddedDate,
        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,
        state: launch.state,
        company: launch.company,
        stateHistory: launch.stateHistory,
    };

    const response = await Accidentdatabase.findOneAndUpdate(
        { AccidentID: launch.AccidentID },
        new_launch,
        { new: true, upsert: true }
    );

    return response || null;
}

async function AddNewAccident(body = null) {
    if (body === null) {
        return { done: false, accident: null };
    }

    const newAccidentID = await getLatestAccidentNumber(new Date().toISOString());

    const newLaunch = {
        AccidentID: newAccidentID,
        ...pickAccidentFields(body),
        AddedDate: new Date().toISOString(),
        ModifiedDate: [],
        IsActive: true,
        state: body.state,
        company: body.company,
        stateHistory: body.stateHistory || [],
    };
      console.log("**********");
      
      console.log(body);
      console.log("**********");
    

    const response = await saveAccident(newLaunch);

    if (response) {
        return { done: true, accident: response };
    }
    return { done: false, accident: null };
}

async function getAllAccident(skip = 0, limit = 0) {
    return await Accidentdatabase
        .find({}, { __v: 0 })
        .populate({ path: 'company', select: { __v: 0 } })
        .populate({ path: 'state', select: { __v: 0 } })
        .populate({ path: 'stateHistory.state', select: { __v: 0 } })
        .populate({ path: 'stateHistory.by', select: { __v: 0, PasswordHash: 0 } })
        .sort({ AccidentID: 1 })
        .skip(skip)
        .limit(limit);
}

async function updateAccident(AccidentID, Accident) {
    const update_accident = await Accidentdatabase.findOneAndUpdate(
        { AccidentID: AccidentID },
        Accident,
        { upsert: false, new: true }
    );
    return update_accident || null;
}

async function EditAccidentById(AccidentID = "", body = null) {
    if (AccidentID === "" || body === null) {
        return { done: false, accident: null };
    }

    const Accident = await existsAccidentWithId(AccidentID);

    if (Accident === null) {
        return { done: false, accident: null };
    }

    const ModifiedDate = Accident.ModifiedDate.slice();
    ModifiedDate.push(new Date().toISOString());

    const editAccident = {
        AccidentID: Accident.AccidentID,
        ...mergeAccidentFields(Accident, body),
        AddedDate: Accident.AddedDate,
        ModifiedDate: ModifiedDate,
        IsActive: body.IsActive !== void (0) ? body.IsActive : Accident.IsActive,
        state: body.state !== void (0) ? body.state : Accident.state,
        company: body.company !== void (0) ? body.company : Accident.company,
        stateHistory: body.stateHistory !== void (0) ? body.stateHistory : Accident.stateHistory,
    };

    const response = await updateAccident(Accident.AccidentID, editAccident);

    if (response) {
        return { done: true, accident: response };
    }
    return { done: false, accident: null };
}

async function AbortAccidentById(AccidentID) {
    const aborted = await Accidentdatabase.deleteOne({ AccidentID: AccidentID });
    if (aborted.deletedCount === 1) {
        return { done: true };
    }
    return { done: false };
}

async function getAllCompanyAccident(skip = 0, limit = 0, companyID) {
    return await Accidentdatabase
        .find({ company: companyID }, { __v: 0 })
        .populate({ path: 'company', select: { __v: 0 } })
        .populate({ path: 'state', select: { __v: 0 } })
        .populate({ path: 'stateHistory.state', select: { __v: 0 } })
        .populate({ path: 'stateHistory.by', select: { __v: 0, PasswordHash: 0 } })
        .sort({ AddedDate: -1 })
        .skip(skip)
        .limit(limit);
}

module.exports = {
    existsAccidentWithId,
    AddNewAccident,
    getAllAccident,
    EditAccidentById,
    AbortAccidentById,
    getAllCompanyAccident,
};

// const axios = require("axios");
// const fs = require("fs");
// const path = require("path");
// const Accidentdatabase = require("./Accident.mongo");
// const uuid = require('uuid');

// // import axios from "axios";
// // import fs from "fs";
// // import path from "path";
// // import { Accidentdatabase } from "./Accident.mongo.js";
// // import { v4 as uuid } from 'uuid';
// // import uuid from "uuid";

// async function findAccident(filter) {
//     return await Accidentdatabase.findOne(filter)
//         .populate({
//             path: 'company',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.by',
//             select: { __v: 0, PasswordHash: 0 }
//         });
// };

// async function existsAccidentWithId(launchId) {
//     return await findAccident({
//         _id: launchId,
//     });
// };

// async function getLatestAccidentNumber(index) {
//     const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
//     const name = index;

//     const latestAccident = uuid.v5(name, namespace);

//     return latestAccident;
// };

// async function saveAccident(launch) {

//     const new_launch = Object.assign({}, {
//         AccidentID: launch.AccidentID,
//         date_of_report: launch.date_of_report,
//         region: launch.region,
//         zone: launch.zone,
//         worda: launch.worda,
//         town: launch.town,
//         specificArea: launch.specificArea,
//         type_of_incident: launch.type_of_incident,
//         categories_of_incident: launch.categories_of_incident,
//         damage_inflicted: launch.damage_inflicted,
//         damage_occurred_to_person: launch.damage_occurred_to_person,
//         numberOfDeaths: launch.numberOfDeaths,
//         numberOfInjured: launch.numberOfInjured,
//         numberOfNoneVictims: launch.numberOfNoneVictims,
//         estimatedPropertyDamage: launch.estimatedPropertyDamage,
//         amountOfFinancialLoss: launch.amountOfFinancialLoss,
//         damageToOrganizationBrand: launch.damageToOrganizationBrand,
//         description: launch.description,
//         actionTaken: launch.actionTaken,
//         actionExecutedByInternalStaff: launch.actionExecutedByInternalStaff,
//         actionExecutedByOutsidePerson: launch.actionExecutedByOutsidePerson,
//         numberOfArrestedSuspects: launch.numberOfArrestedSuspects,
//         numberOfEscapedSuspects: launch.numberOfEscapedSuspects,
//         mainCauseOfIncident: launch.mainCauseOfIncident,
//         statusOfCase: launch.statusOfCase,
//         typeOfSupportExpected: launch.typeOfSupportExpected,

//         AddedDate: launch.AddedDate,
//         ModifiedDate: launch.ModifiedDate,
//         IsActive: launch.IsActive,

//         state: launch.state,
//         company: launch.company,
//         stateHistory: launch.stateHistory,
//     });


//     const response = await Accidentdatabase.findOneAndUpdate(
//         {
//             AccidentID: launch.AccidentID,
//         },
//         new_launch,
//         {
//             new: true,
//             upsert: true,
//         }
//     );

//     if (response) {
//         return response;
//     } else {
//         return null;
//     }
// };

// async function AddNewAccident(body = null) {

//     if (body !== null) {

//         const newAccidentID = (await getLatestAccidentNumber(new Date().toISOString()));

//         const newLaunch = Object.assign({}, {
//             AccidentID: newAccidentID,
//             date_of_report: body.date_of_report,
//             region: body.region,
//             zone: body.zone,
//             worda: body.worda,
//             town: body.town,
//             specificArea: body.specificArea,
//             type_of_incident: body.type_of_incident,
//             categories_of_incident: body.categories_of_incident,
//             damage_inflicted: body.damage_inflicted,
//             damage_occurred_to_person: body.damage_occurred_to_person,
//             numberOfDeaths: body.numberOfDeaths,
//             numberOfInjured: body.numberOfInjured,
//             numberOfNoneVictims: body.numberOfNoneVictims,
//             estimatedPropertyDamage: body.estimatedPropertyDamage,
//             amountOfFinancialLoss: body.amountOfFinancialLoss,
//             damageToOrganizationBrand: body.damageToOrganizationBrand,
//             description: body.description,
//             actionTaken: body.actionTaken,
//             actionExecutedByInternalStaff: body.actionExecutedByInternalStaff,
//             actionExecutedByOutsidePerson: body.actionExecutedByOutsidePerson,
//             numberOfArrestedSuspects: body.numberOfArrestedSuspects,
//             numberOfEscapedSuspects: body.numberOfEscapedSuspects,
//             mainCauseOfIncident: body.mainCauseOfIncident,
//             statusOfCase: body.statusOfCase,
//             typeOfSupportExpected: body.typeOfSupportExpected,



//             AddedDate: new Date().toISOString(),
//             ModifiedDate: [],
//             IsActive: true,

//             state: body.state,
//             company: body.company,
//             stateHistory: body.stateHistory || [],

//         });

//         const response = await saveAccident(newLaunch);

//         if (response) {
//             return { done: true, accident: response };
//         }
//         else {
//             return { done: false, accident: null };
//         }

//     } else {
//         return { done: false, accident: null };
//     }

// };

// async function getAllAccident(skip = 0, limit = 0) {
//     const res = await Accidentdatabase
//         .find({}, { __v: 0 })
//         .populate({
//             path: 'company',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.by',
//             select: { __v: 0, PasswordHash: 0 }
//         })
//         .sort({ AccidentID: 1 })
//         .skip(skip)
//         .limit(limit);
//     return res;

// };

// async function updateAccident(AccidentID, Accident) {

//     const update_accident = await Accidentdatabase.findOneAndUpdate(
//         {
//             AccidentID: AccidentID,
//         },
//         Accident,
//         {
//             upsert: false,
//             new: true,
//         }
//     );
//     if (update_accident) {
//         return update_accident;
//     } else {
//         return null;
//     }

// };

// async function EditAccidentById(AccidentID = "", body = null) {

//     if (AccidentID !== "") {

//         const Accident = await existsAccidentWithId(AccidentID);

//         if (Accident !== null) {

//             if (body !== null) {
//                 const ModifiedDate = Accident.ModifiedDate.slice();
//                 ModifiedDate.push(new Date().toISOString());

//                 const editAccident = Object.assign({}, {
//                     AccidentID: Accident.AccidentID,
//                     date_of_report: body.date_of_report !== void (0) ? body.date_of_report : Accident.date_of_report,
//                     region: body.region !== void (0) ? body.region : Accident.region,
//                     zone: body.zone !== void (0) ? body.zone : Accident.zone,
//                     worda: body.worda !== void (0) ? body.worda : Accident.worda,
//                     town: body.town !== void (0) ? body.town : Accident.town,
//                     specificArea: body.specificArea !== void (0) ? body.specificArea : Accident.specificArea,
//                     type_of_incident: body.type_of_incident !== void (0) ? body.type_of_incident : Accident.type_of_incident,
//                     categories_of_incident: body.categories_of_incident !== void (0) ? body.categories_of_incident : Accident.categories_of_incident,
//                     damage_inflicted: body.damage_inflicted !== void (0) ? body.damage_inflicted : Accident.damage_inflicted,
//                     damage_occurred_to_person: body.damage_occurred_to_person !== void (0) ? body.damage_occurred_to_person : Accident.damage_occurred_to_person,
//                     numberOfDeaths: body.numberOfDeaths !== void (0) ? body.numberOfDeaths : Accident.numberOfDeaths,
//                     numberOfInjured: body.numberOfInjured !== void (0) ? body.numberOfInjured : Accident.numberOfInjured,
//                     numberOfNoneVictims: body.numberOfNoneVictims !== void (0) ? body.numberOfNoneVictims : Accident.numberOfNoneVictims,
//                     estimatedPropertyDamage: body.estimatedPropertyDamage !== void (0) ? body.estimatedPropertyDamage : Accident.estimatedPropertyDamage,
//                     amountOfFinancialLoss: body.amountOfFinancialLoss !== void (0) ? body.amountOfFinancialLoss : Accident.amountOfFinancialLoss,
//                     damageToOrganizationBrand: body.damageToOrganizationBrand !== void (0) ? body.damageToOrganizationBrand : Accident.damageToOrganizationBrand,
//                     description: body.description !== void (0) ? body.description : Accident.description,
//                     actionTaken: body.actionTaken !== void (0) ? body.actionTaken : Accident.actionTaken,
//                     actionExecutedByInternalStaff: body.actionExecutedByInternalStaff !== void (0) ? body.actionExecutedByInternalStaff : Accident.actionExecutedByInternalStaff,
//                     actionExecutedByOutsidePerson: body.actionExecutedByOutsidePerson !== void (0) ? body.actionExecutedByOutsidePerson : Accident.actionExecutedByOutsidePerson,
//                     numberOfArrestedSuspects: body.numberOfArrestedSuspects !== void (0) ? body.numberOfArrestedSuspects : Accident.numberOfArrestedSuspects,
//                     numberOfEscapedSuspects: body.numberOfEscapedSuspects !== void (0) ? body.numberOfEscapedSuspects : Accident.numberOfEscapedSuspects,
//                     mainCauseOfIncident: body.mainCauseOfIncident !== void (0) ? body.mainCauseOfIncident : Accident.mainCauseOfIncident,
//                     statusOfCase: body.statusOfCase !== void (0) ? body.statusOfCase : Accident.statusOfCase,
//                     typeOfSupportExpected: body.typeOfSupportExpected !== void (0) ? body.typeOfSupportExpected : Accident.typeOfSupportExpected,

//                     AddedDate: Accident.AddedDate,
//                     ModifiedDate: ModifiedDate,
//                     IsActive: body.IsActive !== void (0) ? body.IsActive : Accident.IsActive,
//                     state: body.state !== void (0) ? body.state : Accident.state,
//                     company: body.company !== void (0) ? body.company : Accident.company,
//                     stateHistory: body.stateHistory !== void (0) ? body.stateHistory : Accident.stateHistory,

//                 });

//                 const response = await updateAccident(Accident.AccidentID, editAccident);

//                 if (response) {
//                     return { done: true, accident: response };
//                 }
//                 else {
//                     return { done: false, accident: null };
//                 }

//             } else {
//                 return { done: false, accident: null };
//             }

//         }
//         else {

//             return { done: false, accident: null };
//         }

//     }
//     else {

//         return { done: false, accident: null };

//     }

// };

// async function AbortAccidentById(AccidentID) {

//     const aborted = await Accidentdatabase.deleteOne(
//         {
//             AccidentID: AccidentID,
//         }
//     );
//     if (aborted.deletedCount === 1) {

//         return { done: true };
//     }
//     else {
//         return { done: false };
//     }

// };

// async function getAllCompanyAccident(skip = 0, limit = 0, companyID) {
//     const res = await Accidentdatabase
//         .find({ company: companyID }, { __v: 0 })
//         .populate({
//             path: 'company',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.state',
//             select: { __v: 0 }
//         })
//         .populate({
//             path: 'stateHistory.by',
//             select: { __v: 0, PasswordHash: 0 }
//         })
//         .sort({ AddedDate: -1 })
//         .skip(skip)
//         .limit(limit);
//     return res;

// };

// module.exports = {

//     existsAccidentWithId,
//     AddNewAccident,
//     getAllAccident,
//     EditAccidentById,
//     AbortAccidentById,
//     getAllCompanyAccident

// };
