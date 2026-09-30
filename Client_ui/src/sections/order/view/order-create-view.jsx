import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { OrderNewEditForm } from '../order-new-edit-form';

// ----------------------------------------------------------------------

export function OrderCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new WorkFlow"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'WorkFlow', href: paths.dashboard.workflow.root },
          { name: 'New WorkFlow' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <OrderNewEditForm />
    </DashboardContent>
  );
}
