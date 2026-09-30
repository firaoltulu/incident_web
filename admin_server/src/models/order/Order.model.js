const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Orderdatabase = require("./Order.mongo");
const uuid = require('uuid');

async function findOrder(filter) {
    return await Orderdatabase.findOne(filter);
};

async function existsOrderWithId(launchId) {
    return await findOrder({
        OrderID: launchId,
    });
};


async function getLatestOrderNumber(index) {
    const namespace = uuid.parse('86044be7-fd2a-45d8-a091-988d63e74ab9')
    const name = index;

    const latestOrder = uuid.v5(name, namespace);

    return latestOrder;
};

async function saveOrder(launch) {

    const new_launch = Object.assign({}, {

        OrderID: launch.OrderID,
        Received_By: launch.Received_By,
        Name: launch.Name,

        Company: launch.Company,
        Department: launch.Department,
        Branch: launch.Branch,
        ServiceParentGroup: launch.ServiceParentGroup,
        Service: launch.Service,
        Machine_Fault: launch.Machine_Fault,
        Solution_provided: launch.Solution_provided,
        Reason: launch.Reason,

        Recommendation: launch.Recommendation,
        Service_provided: launch.Service_provided,
        Status: launch.Status,

        AddedDate: launch.AddedDate,

        ModifiedDate: launch.ModifiedDate,


    });

    const response = await Orderdatabase.findOneAndUpdate(
        {
            OrderID: launch.OrderID,
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

async function AddNewOrder(body = null) {

    if (body !== null) {

        const newOrderID = (await getLatestOrderNumber(new Date().toISOString()));

        const Service_provided = await AddServiceProvided(body.Service_provided);

        const newLaunch = Object.assign({}, {
            OrderID: newOrderID,
            Received_By: body.Received_By,
            Name: body.Name,

            Company: body.Company,
            Department: body.Department,
            Branch: body.Branch,
            ServiceParentGroup: body.ServiceParentGroup,
            Service: body.Service,
            Machine_Fault: body.Machine_Fault,
            Solution_provided: body.Solution_provided,
            Reason: body.Reason,

            Recommendation: body.Recommendation,
            Service_provided: Service_provided,
            Status: body.Status,


            AddedDate: new Date().toISOString(),
            ModifiedDate: [],

        });

        console.log({ newLaunch });

        const response = await saveOrder(newLaunch);

        if (response) {
            return { done: true, order: response };
        }
        else {
            return { done: false, order: null };
        }

    } else {
        return { done: false, order: null };
    }

};

async function getAllOrder(skip = 0, limit = 0) {
    const res = await Orderdatabase
        .find({}, { _id: 0, __v: 0 })
        .sort({ OrderID: 1 })
        .skip(skip)
        .limit(limit);
    return res;

};

async function updateOrder(OrderID, Order) {

    const update_order = await Orderdatabase.findOneAndUpdate(
        {
            OrderID: OrderID,
        },
        Order,
        {
            upsert: false,
            new: true,
        }
    );
    if (update_order) {
        return update_order;
    } else {
        return null;
    }

};

async function EditOrderById(OrderID = "", body = null) {

    if (OrderID !== "") {

        console.log({ OrderID })


        const order = await existsOrderWithId(OrderID);

        if (order) {

            if (body !== null) {

                const ModifiedDate = order.ModifiedDate.slice();
                ModifiedDate.push(new Date().toISOString());

                const Service_provided = await AddServiceProvided(body?.Service_provided);


                const editOrder = Object.assign({}, {

                    Received_By: body.Received_By !== void (0) ? body.Received_By : order.Received_By,
                    Name: body.Name !== void (0) ? body.Name : order.Name,

                    Company: body.Company !== void (0) ? body.Company : order.Company,
                    Department: body.Department !== void (0) ? body.Department : order.Department,
                    Branch: body.Branch !== void (0) ? body.Branch : order.Branch,
                    ServiceParentGroup: body.ServiceParentGroup !== void (0) ? body.ServiceParentGroup : order.ServiceParentGroup,
                    Service: body.Service !== void (0) ? body.Service : order.Service,
                    Machine_Fault: body.Machine_Fault !== void (0) ? body.Machine_Fault : order.Machine_Fault,
                    Solution_provided: body.Solution_provided !== void (0) ? body.Solution_provided : order.Solution_provided,
                    Reason: body.Reason !== void (0) ? body.Reason : order.Reason,

                    Recommendation: body.Recommendation !== void (0) ? body.Recommendation : order.Recommendation,
                    Service_provided: body.Service_provided !== void (0) ? Service_provided : order.Service_provided,
                    Status: body.Status !== void (0) ? body.Status : order.Status,


                    AddedDate: order.AddedDate,
                    ModifiedDate: ModifiedDate,

                });

                // console.log({ editOrder })

                const response = await updateOrder(order.OrderID, editOrder);

                if (response) {
                    return { done: true, order: response };
                }
                else {
                    return { done: false, order: null };
                }

            } else {
                return { done: false, order: null };
            }

        }
        else {
            return { done: false, order: null };
        }

    }
    else {

        return { done: false, order: null };

    }

};

async function AbortOrderById(OrderID = "") {

    const aborted = await Orderdatabase.deleteOne(
        {
            OrderID: OrderID,
        }
    );
    if (aborted.deletedCount === 1) {

        return { done: true };
    }
    else {
        return { done: false };
    }

};

async function AddServiceProvided(servicesProvided = []) {
    const arr = await Promise.all(servicesProvided.map(async (item, index) => ({
        SID: await getLatestOrderNumber(`${new Date().toISOString()}-${index}`),
        AddedDate: new Date().toISOString(),
        ModifiedDate: [],
        ...item
    })));

    return arr;
}

async function getOrder_Length() {

    const res = await Orderdatabase.find({}, { _id: 0, __v: 0 });
    return res.length;

};

module.exports = {

    existsOrderWithId,
    AddNewOrder,
    getAllOrder,
    EditOrderById,
    AbortOrderById,
    getOrder_Length
};
