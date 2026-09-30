import { useMemo } from 'react';

import { useGetWorkFlows } from 'src/actions/workflow';

import { WorkflowContext } from './workflow-context';

// ----------------------------------------------------------------------

export function WorkflowProvider({ children }) {
    const { workflows, workflowsLoading, workflowsError, workflowsValidating, workflowsEmpty } = useGetWorkFlows();

    const memoizedValue = useMemo(
        () => ({
            workflows,
            workflowsLoading,
            workflowsError,
            workflowsValidating,
            workflowsEmpty,
        }),
        [workflows, workflowsLoading, workflowsError, workflowsValidating, workflowsEmpty]
    );

    return <WorkflowContext.Provider value={memoizedValue}>{children}</WorkflowContext.Provider>;
}

// export default WorkflowProvider;
