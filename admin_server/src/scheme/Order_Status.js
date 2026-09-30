const ORDER_STATUS_OPTIONS = [
    { value: 0 },
    { value: 1 },
    { value: 2 },
];

function checkAllExistStatus(arr1) {
    const values = ORDER_STATUS_OPTIONS.map(item => item.value);

    const allExist = el => values.includes(arr1);

    return allExist ? 1 : 0;
}
module.exports = { checkAllExistStatus, ORDER_STATUS_OPTIONS };