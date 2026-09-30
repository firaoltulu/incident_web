

function convertUserRolesToIds(userRoles) {
    if (!Array.isArray(userRoles)) return []
    return userRoles.map(role => role._id)
}

export function getAvailableWorkflowActions({
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
            const sameState = rule.state._id === currentStateId
            const roleAllowed = roleIds.includes(rule.allowed._id)

            return sameState && roleAllowed
        })
        .map(rule => {

            const nextState = workflow.States.find(
                s => s.state._id === rule.next_state._id
            )

            const action = actions.find(
                a => a._id === rule.action._id
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

export function canEditDocument({ workflow, stateId, userRoles }) {
    const roleIds = convertUserRolesToIds(userRoles);

    const states = workflow?.States.filter(
        s => s.state._id === stateId
    )

    if (states?.length === 0) return false

    return states?.some(s =>
        roleIds.includes(s.only_allow_edit_for?._id)
    )

}