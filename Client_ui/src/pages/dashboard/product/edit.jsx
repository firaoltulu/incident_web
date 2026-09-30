import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetCompany } from 'src/actions/product';

import { ProductEditView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Company edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { company } = useGetCompany(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ProductEditView company={company} />
    </>
  );
}
