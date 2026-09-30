import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductNewEditForm } from '../Company-new-edit-form';

// ----------------------------------------------------------------------

export function ProductCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new Company"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Company', href: paths.dashboard.service.root },
          { name: 'New Company' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </DashboardContent>
  );
}
