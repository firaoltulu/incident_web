import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccidentListView } from 'src/sections/accident/view';

// ----------------------------------------------------------------------

const metadata = { title: `Accident list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccidentListView />
    </>
  );
}
