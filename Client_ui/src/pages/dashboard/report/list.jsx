import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AccidentReportListView } from 'src/sections/report/view';

// ----------------------------------------------------------------------

const metadata = { title: `Accident Report | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccidentReportListView />
    </>
  );
}
