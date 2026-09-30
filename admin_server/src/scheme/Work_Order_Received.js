const WORK_ORDER_RECEIVED_OPTIONS = [
    { value: 'Tel' },
    { value: 'Person' },
    { value: 'Email' },
    { value: 'Other' },
];

function checkAllExist(arr1) {
    const values = WORK_ORDER_RECEIVED_OPTIONS.map(item => item.value);

    const allExist = arr1.every(el => values.includes(el));

    return allExist ? 1 : 0;
}
module.exports = { checkAllExist };