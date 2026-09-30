import { useContext } from 'react';

import { WorkflowContext } from '../context/workflow-context';

// ----------------------------------------------------------------------

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);

  if (!context) {
    throw new Error('useWorkflowContext: Context must be used inside WorkflowProvider');
  }

  return context;
}

export default useWorkflowContext;
