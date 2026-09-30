const fs = require("fs");
const path = require("path");
require('dotenv').config();

const {
    existsOrderWithId,
    AddNewOrder,
    getAllOrder,
    EditOrderById,
    AbortOrderById,
    getOrder_Length
} = require("../../models/order/Order.model");

const { getPagination } = require("../../services/query");
const { checkAllExist } = require("../../scheme/Work_Order_Received");
const { existsServiceWithId, } = require("../../models/company/Company.model");
const { checkAllExistStatus } = require("../../scheme/Order_Status");

function validateServices(array) {
    for (const item of array) {
        if (
            !item.Type_of_service ||              // empty, null, undefined, ""
            item.Type_of_service.trim() === "" ||
            item.Qty === null ||
            item.Qty === undefined ||
            item.Qty === "" ||
            isNaN(item.Qty)
        ) {
            return false;
        }
    }
    return true;
}

async function httpAddNewOrder(req, res) {

    try {

        const body = req.body;


        if (body.name != "" && body.company != "" && body.department != "" && body.parentGroup != "" &&
            body.service != "" && body.work_order_received.length > 0) {

            const check_it = checkAllExist(body.work_order_received);
            const validateServicesResult = validateServices(body.service_provided);

            if (check_it === 1 && validateServicesResult === true) {

                const exists_parent_Service = await existsServiceWithId(body.parentGroup);

                if (exists_parent_Service && exists_parent_Service.IsGroup === true) {

                    const exists_child_Service = await existsServiceWithId(body.service);

                    if (exists_child_Service && exists_child_Service.IsGroup === false &&
                        exists_child_Service.ParentGroup === exists_parent_Service.ServiceID
                    ) {
                        const newOrder = Object.assign({}, {
                            Received_By: body.work_order_received,
                            Name: body.name,

                            Company: body.company,
                            Department: body.department,
                            Branch: body.Branch,
                            ServiceParentGroup: body.parentGroup,
                            Service: body.service,
                            Machine_Fault: body.machine_fault,
                            Solution_provided: body.solution_provided,
                            Reason: body.reason,

                            Recommendation: body.recommendation,
                            Service_provided: body.service_provided,
                            Status: 0,
                        });
                        const orderExists = await AddNewOrder(newOrder);
                        if (orderExists.done === true) {
                            return res.status(200).json({ message: "Order successfully added", reason: 1 });
                        }
                        else {
                            return res.status(400).json({ message: "Required fields not specfied", reason: 2 });
                        }

                    }
                    else {
                        return res.status(400).json({ message: "The Selected Service is not a child Service", reason: 3 });
                    }

                }
                else {
                    return res.status(400).json({ message: "Parent Group does not exist", reason: 4 });
                }

            } else {
                return res.status(400).json({ message: "One or more Work Order Received entries are invalid", reason: 5 });
            }


        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 6 });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 7 });
    }

};

async function httpListOrder(req, res) {

    try {

        const body = req.body;

        const { index, step } = req.query;

        const pagination = getPagination({ page: index, limit: step });
        // pagination.skip, pagination.limit
        const response = await getAllOrder();

        const new_arr = await Promise.all(response.map(async (item, index) => {

            if (item.ServiceParentGroup === "" && item.Service === "") {
                var new_obj_parent = Object.assign({
                    parentId: "",
                    parentLabel: "",
                });

                var new_obj = Object.assign({
                    id: item.OrderID,
                    ...item._doc,
                    ParentGroup: new_obj_parent,
                    Service: new_obj_parent

                });
                return new_obj;

            }
            else {
                const exists_parent_Service = await existsServiceWithId(item.ServiceParentGroup);
                const exists_child_Service = await existsServiceWithId(item.Service);

                var new_obj_parent = Object.assign({
                    parentId: exists_parent_Service.ServiceID,
                    parentLabel: exists_parent_Service.Name,
                });

                var new_obj_child = Object.assign({
                    parentId: exists_child_Service.ServiceID,
                    serviceLabel: exists_child_Service.Name,
                });

                var new_obj = Object.assign({
                    id: item.OrderID,
                    ...item._doc,
                    ServiceParentGroup: new_obj_parent,
                    Service: new_obj_child
                });

                return new_obj;

            }

        }));

        const length = await getOrder_Length();

        return res.status(200).json({ message: "Service get was successful!!", reason: 1, orders: new_arr, length: length });


    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 2, orders: [], length: 0 });
    }

};

async function httpGetOrder(req, res) {

    try {

        const { orderId } = req.query;

        const exists_Order = await existsOrderWithId(orderId);
        if (exists_Order) {
            var new_obj = Object.assign({
                id: exists_Order.OrderID,
                ...exists_Order._doc
            });

            return res.status(200).json({ message: "order get was successful!!", reason: 1, order: new_obj });
        } else {
            return res.status(400).json({ message: "order does not exist", reason: 2, order: null });
        }

    } catch (error) {
        return res.status(400).json({ message: "Error Please Try again", reason: 3, order: null });
    }
};

async function httpEditOrder(req, res) {
    try {

        const body = req.body;

        if (body.name != "" && body.company != "" && body.department != "" && body.parentGroup != "" &&
            body.service != "" && body.work_order_received.length > 0 && body.OrderID != "") {

            const check_it = checkAllExist(body.work_order_received);
            const validateServicesResult = validateServices(body.service_provided);

            if (check_it === 1 && validateServicesResult === true) {

                const exists_parent_Service = await existsServiceWithId(body.parentGroup);

                if (exists_parent_Service && exists_parent_Service.IsGroup === true) {

                    const exists_child_Service = await existsServiceWithId(body.service);

                    if (exists_child_Service && exists_child_Service.IsGroup === false &&
                        exists_child_Service.ParentGroup === exists_parent_Service.ServiceID
                    ) {
                        const editOrder = Object.assign({}, {
                            Received_By: body.work_order_received,
                            Name: body.name,

                            Company: body.company,
                            Department: body.department,
                            Branch: body.Branch,
                            ServiceParentGroup: body.parentGroup,
                            Service: body.service,
                            Machine_Fault: body.machine_fault,
                            Solution_provided: body.solution_provided,
                            Reason: body.reason,

                            Recommendation: body.recommendation,
                            Service_provided: body.service_provided,
                            Status: 0,
                        });


                        const orderExists = await EditOrderById(body.OrderID, editOrder);
                        if (orderExists.done === true) {
                            return res.status(200).json({ message: "Order successfully Edited", reason: 1 });
                        }
                        else {
                            return res.status(400).json({ message: "Required fields not specfied", reason: 2 });
                        }

                    }
                    else {
                        return res.status(400).json({ message: "The Selected Service is not a child Service", reason: 3 });
                    }

                }
                else {
                    return res.status(400).json({ message: "Parent Group does not exist", reason: 4 });
                }

            } else {
                return res.status(400).json({ message: "One or more Work Order Received entries are invalid", reason: 5 });
            }


        } else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 6 });
        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 7 });
    }

};

async function httpEditOrderStatus(req, res) {
    const body = req.body;
    console.log({ body });

    try {



        if (body.OrderID != "") {

            const status = checkAllExistStatus(body.status);
            console.log({ status });
            if (status === 1) {

                const editOrder = Object.assign({}, {
                    Status: body.status,
                });


                const orderExists = await EditOrderById(body.OrderID, editOrder);
                if (orderExists.done === true) {
                    return res.status(200).json({ message: "Order successfully Edited", reason: 1 });
                }
                else {
                    return res.status(400).json({ message: "Required fields not specfied", reason: 2 });
                }

            }
            else {
                return res.status(400).json({ message: "Required fields not specfied", reason: 3 });

            }

        }
        else {
            return res.status(400).json({ message: "Required fields not specfied", reason: 4 });

        }

    } catch (error) {
        return res.status(400).json({ message: "Required fields not specfied", reason: 5 });

    }
};

module.exports = {
    httpAddNewOrder,
    httpListOrder,
    httpGetOrder,
    httpEditOrder,
    httpEditOrderStatus
};


