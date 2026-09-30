const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Companydatabase = require("./Company.mongo");
const uuid = require('uuid');

async function findCompany(filter) {
    return await Companydatabase.findOne(filter);
};

async function existsCompanyWithId(launchId) {
    return await findCompany({
        _id: launchId,
    });
};

async function getLatestCompanyNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestCompany = uuid.v5(name, namespace);

    return latestCompany;
};

async function saveCompany(launch) {

    const new_launch = Object.assign({}, {
        CompanyID: launch.CompanyID,
        Name: launch.Name,
        Description: launch.Description,
        AddedDate: launch.AddedDate,

        ModifiedDate: launch.ModifiedDate,
        IsActive: launch.IsActive,
        IsGroup: launch.IsGroup,
        ParentGroup: launch.ParentGroup,
        IsBanned: launch.IsBanned,

    });


    const response = await Companydatabase.findOneAndUpdate(
        {
            CompanyID: launch.CompanyID,
        },
        new_launch,
        {
            new: true,
            upsert: true,
        }
    );

    if (response) {
        return response;
    } else {
        return null;
    }
};

async function AddNewCompany(body = null) {

    if (body !== null) {

        const newCompanyID = (await getLatestCompanyNumber(new Date().toISOString()));

        const newLaunch = Object.assign({}, {
            CompanyID: newCompanyID,
            Name: body.Name,
            Description: body.Description,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
            IsActive: false,
            IsGroup: body.IsGroup,
            ParentGroup: body.ParentGroup,
            IsBanned: false,

        });

        const response = await saveCompany(newLaunch);

        if (response) {
            return { done: true, company: response };
        }
        else {
            return { done: false, company: null };
        }

    } else {
        return { done: false, company: null };
    }

};

async function getAllCompany(skip = 0, limit = 0) {
    const res = await Companydatabase
        .find({}, { __v: 0 })
        // .populate({
        //     path: 'ParentGroup',
        //     select: { _id: 0, __v: 0 }
        // })
        .sort({ AddedDate: -1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateCompany(CompanyID, Company) {

    const update_company = await Companydatabase.findOneAndUpdate(
        {
            CompanyID: CompanyID,
        },
        Company,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_company) {
        return update_company;
    } else {
        return null;
    }

};

async function EditCompanyById(CompanyID = "", body = null) {

    if (CompanyID !== "") {

        const Company = await existsCompanyWithCompanyId(CompanyID);

        if (Company !== null) {

            if (body !== null) {
                const ModifiedDate = Company.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editCompany = Object.assign({}, {

                    Name: body.Name !== void (0) ? body.Name : Company.Name,
                    Description: body.Description !== void (0) ? body.Description : Company.Description,
                    AddedDate: Company.AddedDate,
                    ModifiedDate: ModifiedDate,
                    IsActive: body.IsActive !== void (0) ? body.IsActive : Company.IsActive,
                    IsBanned: body.IsBanned !== void (0) ? body.IsBanned : Company.IsBanned,

                    ParentGroup: body.ParentGroup !== void (0) ? body.ParentGroup : Company.ParentGroup,
                    IsGroup: Company.IsGroup,

                });

                const response = await updateCompany(Company.CompanyID, editCompany);

                if (response) {
                    return { done: true, company: response };
                }
                else {
                    return { done: false, company: null };
                }

            } else {
                return { done: false, company: null };
            }

        }
        else {

            return { done: false, company: null };
        }

    }
    else {

        return { done: false, company: null };

    }

};

async function AbortCompanyById(CompanyID) {

    const aborted = await Companydatabase.deleteOne(
        {
            CompanyID: CompanyID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }

};

async function existsCompanyWithCompanyId(launchId) {
    return await findCompany({
        CompanyID: launchId,
    });
};

module.exports = {
    existsCompanyWithCompanyId,
    existsCompanyWithId,
    AddNewCompany,
    getAllCompany,
    EditCompanyById,
    AbortCompanyById,


};
