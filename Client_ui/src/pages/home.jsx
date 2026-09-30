import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

const metadata = {
  title: 'Midroc: Midroc Investment Group has been a powerful catalyst for Ethiopia’s growth',
  description:
    'As one of the nation’s largest and most diversified investment groups, we operate across six key clusters: Agriculture & Agro-Processing, Manufacturing, Mining, Commerce, Hotel & Tourism, and Construction Real Estate.',
};

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>

      <HomeView />
    </>
  );
}
