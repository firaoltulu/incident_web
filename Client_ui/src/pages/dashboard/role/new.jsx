import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TourCreateView } from 'src/sections/role/view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new Role | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <TourCreateView />
    </>
  );
}
