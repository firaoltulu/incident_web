import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AccidentNewEditForm } from '../accident-new-edit-form';

// ----------------------------------------------------------------------

export function AccidentCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Accident"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Accident', href: paths.dashboard.accident.root },
          { name: 'New Accident' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AccidentNewEditForm />
    </DashboardContent>
  );
}
