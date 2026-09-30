import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetRole } from 'src/actions/role';

import { TourEditView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

const metadata = { title: `Role edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { role, rolesLoading } = useGetRole(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourEditView role={role} />
    </>
  );
}
