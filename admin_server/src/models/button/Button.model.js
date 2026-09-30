const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Buttondatabase = require("./Button.mongo");
const uuid = require('uuid');

async function findButton(filter) {
    return await Buttondatabase.findOne(filter);
};

async function existsButtonWithId(buttonId) {
    return await findButton({
        _id: buttonId,
    });
};


async function getLatestButtonNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestButton = uuid.v5(name, namespace);

    return latestButton;
};

async function saveButton(button) {

    const new_button = Object.assign({}, {
        ButtonID: button.ButtonID,
        Name: button.Name,
        Color: button.Color,
        AddedDate: button.AddedDate,
        ModifiedDate: button.ModifiedDate,
    });


    const response = await Buttondatabase.findOneAndUpdate(
        {
            ButtonID: button.ButtonID,
        },
        new_button,
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

async function AddNewButton(body = null) {

    if (body !== null) {

        const newButtonID = (await getLatestButtonNumber(new Date().toISOString()));

        const newButton = Object.assign({}, {
            ButtonID: newButtonID,
            Name: body.Name,
            Color: body.Color,
            AddedDate: new Date().toISOString(),
            ModifiedDate: [],
        });

        const response = await saveButton(newButton);

        if (response) {
            return { done: true, button: response };
        }
        else {
            return { done: false, button: null };
        }

    } else {
        return { done: false, button: null };
    }

};

async function getAllButtons(skip = 0, limit = 0) {
    const res = await Buttondatabase
        .find({}, { __v: 0 })
        .sort({ AddedDate: 1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateButton(ButtonID, ButtonState) {

    const update_button = await Buttondatabase.findOneAndUpdate(
        {
            _id: ButtonID,
        },
        ButtonState,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_button) {
        return update_button;
    } else {
        return null;
    }

};

async function EditButtonStateById(ButtonID = "", body = null) {

    if (ButtonID !== "") {

        const Button = await existsButtonWithId(ButtonID);

        if (Button !== null) {

            if (body !== null) {
                const ModifiedDate = Button.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const editButton = Object.assign({}, {
                    Name: body.Name !== void (0) ? body.Name : Button.Name,
                    Color: body.Color !== void (0) ? body.Color : Button.Color,
                    AddedDate: Button.AddedDate,
                    ModifiedDate: ModifiedDate,
                });

                const response = await updateButton(Button._id, editButton);

                if (response) {
                    return { done: true, button: response };
                }
                else {
                    return { done: false, button: null };
                }

            } else {
                return { done: false, button: null };
            }

        }
        else {
            return { done: false, button: null };
        }

    }
    else {
        return { done: false, button: null };
    }

};

async function AbortButtonById(ButtonID) {

    const aborted = await Buttondatabase.deleteOne(
        {
            _id: ButtonID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }

};

module.exports = {

    existsButtonWithId,
    AddNewButton,
    getAllButtons,
    EditButtonStateById,
    AbortButtonById,


};
