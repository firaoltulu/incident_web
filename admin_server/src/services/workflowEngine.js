

function convertUserRolesToIds(userRoles) {
    if (!Array.isArray(userRoles)) return []
    return userRoles.map(role => String(role._id))
}

function getAvailableWorkflowActions({
    workflow,
    currentStateId,
    userRoles,
    actions
}) {
    if (!workflow) return [];

    const roleIds = convertUserRolesToIds(userRoles);


    const transitions = workflow.Transition_Rules || []


    const allowedActions = transitions
        .filter(rule => {


            const sameState = String(rule.state._id) === String(currentStateId);
            const roleAllowed = roleIds.includes(String(rule.allowed._id))

            return sameState && roleAllowed
        })
        .map(rule => {

            const nextState = workflow.States.find(
                s => String(s.state._id) === String(rule.next_state._id)
            )

            const action = actions.find(
                a => String(a._id) === String(rule.action._id)
            )

            return {
                _id: rule._id,
                currentState: rule.state,
                actionId: rule.action,
                actionName: action?.Name,
                actionColor: action?.Color,
                nextStateId: rule.next_state,
                nextStateName: nextState?.state?.Name
            }
        })

    return allowedActions;
}

function canEditDocument({ workflow, stateId, userRoles }) {
    const roleIds = convertUserRolesToIds(userRoles);

    const states = workflow?.States.filter(
        s => String(s.state._id) === String(stateId)
    )

    if (states?.length === 0) return false

    return states?.some(s =>
        roleIds.includes(String(s.only_allow_edit_for?._id))
    )

}

module.exports = {
    canEditDocument,
    getAvailableWorkflowActions,
    // httpListGroupAccident,
    // httpEditAccident
};
