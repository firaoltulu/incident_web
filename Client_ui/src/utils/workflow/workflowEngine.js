

function convertUserRolesToIds(userRoles) {
    if (!Array.isArray(userRoles)) return []
    return userRoles.filter(role => role?._id != null).map(role => role._id)
}

export function getAvailableWorkflowActions({
    workflow,
    currentStateId,
    userRoles,
    actions
}) {
    if (!workflow) return [];

    const roleIds = convertUserRolesToIds(userRoles);

    const transitions = Array.isArray(workflow.Transition_Rules) ? workflow.Transition_Rules : []

    const allowedActions = transitions
        .filter(rule => {
            if (
                rule?.state?._id == null ||
                rule?.allowed?._id == null ||
                rule?.next_state?._id == null ||
                rule?.action?._id == null
            ) return false

            const sameState = rule.state._id === currentStateId
            const roleAllowed = roleIds.includes(rule.allowed._id)

            return sameState && roleAllowed
        })
        .map(rule => {

            const nextState = (workflow.States || []).find(
                s => s.state._id === rule.next_state._id
            )

            const action = (actions || []).find(
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

    const states = (Array.isArray(workflow?.States) ? workflow.States : []).filter(
        s => s?.state?._id === stateId
    )

    if (states?.length === 0) return false
    if (states.some(s => [1, 2].includes(Number(s.doc_status)))) return false

    return states?.some(s =>
        roleIds.includes(s.only_allow_edit_for?._id)
    )

}