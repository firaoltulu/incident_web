import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetWorkflow } from 'src/actions/workflow';

import { WorkFlowEditView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

const metadata = { title: `WorkFlow edit | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();

  const { workflow, workflowLoading } = useGetWorkflow(id);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <WorkFlowEditView workflow={workflow} loading={workflowLoading} />
    </>
  );
}
