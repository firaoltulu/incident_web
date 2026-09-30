import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccidentCreateView } from 'src/sections/accident/view/accident-create-view';

// ----------------------------------------------------------------------

const metadata = { title: `Create a new WorkFlow | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccidentCreateView />
    </>
  );
}
