import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { TourNewEditForm } from '../tour-new-edit-form';

// ----------------------------------------------------------------------

export function TourEditView({ role }) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'role', href: paths.dashboard.role.root },
          { name: role?.Name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <TourNewEditForm currentRole={role} />
    </DashboardContent>
  );
}
