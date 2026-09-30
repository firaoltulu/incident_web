import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `Work-Flow list | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderListView />
    </>
  );
}
