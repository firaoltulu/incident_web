import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetAccidentDetails } from 'src/actions/accident';

import { AccidentNewEditForm } from 'src/sections/accident/accident-new-edit-form';

// ----------------------------------------------------------------------

const metadata = { title: `Accident details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { id = '' } = useParams();
  const { accident, accidentLoading, accidentError, refetch } = useGetAccidentDetails(id);
  const [accidentState, setAccidentState] = useState(accident);

  useEffect(() => {
    setAccidentState(accident);
  }, [accident]);

  const handleAccidentUpdate = async (updatedAccident) => {
    setAccidentState(updatedAccident);
    // Optionally refetch from server
    if (typeof refetch === 'function') {
      await refetch();
    }
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AccidentNewEditForm
        currentAccident={accidentState}
        loading={accidentLoading}
        loaderror={accidentError}
        onAccidentUpdate={handleAccidentUpdate}
      />
    </>
  );
}
