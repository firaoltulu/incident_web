import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HelpMeView } from 'src/sections/about/view';

// ----------------------------------------------------------------------

const metadata = { title: `Help me - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>
      <HelpMeView />
    </>
  );
}
