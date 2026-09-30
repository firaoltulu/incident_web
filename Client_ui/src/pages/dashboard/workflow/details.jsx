import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetOrder } from 'src/actions/order';

import { OrderNewEditForm } from 'src/sections/order/order-new-edit-form';

// ----------------------------------------------------------------------

const metadata = { title: `Order details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { order, orderLoading, orderError } = useGetOrder(id);


  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <OrderNewEditForm currentOrder={order} loading={orderLoading} error={orderError} />
    </>
  );
}
