import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';

// ----------------------------------------------------------------------

export function TourCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new role"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Role', href: paths.dashboard.role.root },
          { name: 'New role' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TourNewEditForm />
    </DashboardContent>
  );
}
