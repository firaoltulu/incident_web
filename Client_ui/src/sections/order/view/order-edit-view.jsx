import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderNewEditForm } from '../order-new-edit-form';

// ----------------------------------------------------------------------

export function WorkFlowEditView({ workflow, loading }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Workflow', href: paths.dashboard.workflow.root },
          { name: workflow?.Name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OrderNewEditForm currentWorkFlow={workflow} loading={loading} />
    </DashboardContent>
  );
}
