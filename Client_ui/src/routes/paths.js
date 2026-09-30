
import { _id } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];


const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  helpMe: '/help-me',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://firaoltulu.vercel.app/',
  firaolStore: 'https://firaoltulu.vercel.app/',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  // AUTH
  auth: {
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
  },
  // DASHBOARD
  dashboard: {

    root: `${ROOTS.DASHBOARD}/`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    permission: `${ROOTS.DASHBOARD}/permission`,

    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      // account: `${ROOTS.DASHBOARD}/user/account`,
      account: (id) => `${ROOTS.DASHBOARD}/user/${id}/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },

    service: {
      root: `${ROOTS.DASHBOARD}/company`,
      new: `${ROOTS.DASHBOARD}/company/new`,
      details: (id) => `${ROOTS.DASHBOARD}/company/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/company/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/company/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/company/${MOCK_ID}/edit`,
      },
    },

    report: {
      root: `${ROOTS.DASHBOARD}/report`,
    },

    accident: {
      root: `${ROOTS.DASHBOARD}/accident`,
      details: (id) => `${ROOTS.DASHBOARD}/accident/${id}`,
      new: `${ROOTS.DASHBOARD}/accident/new`,
      demo: {
        details: `${ROOTS.DASHBOARD}/accident/${MOCK_ID}`,
      },
      edit: (id) => `${ROOTS.DASHBOARD}/accident/${id}/edit`,

    },

    role: {
      root: `${ROOTS.DASHBOARD}/role`,
      new: `${ROOTS.DASHBOARD}/role/new`,
      details: (id) => `${ROOTS.DASHBOARD}/role/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/role/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/role/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/role/${MOCK_ID}/edit`,
      },
    },

    workflow: {
      root: `${ROOTS.DASHBOARD}/workflow`,
      details: (id) => `${ROOTS.DASHBOARD}/workflow/${id}`,
      new: `${ROOTS.DASHBOARD}/workflow/new`,
      demo: {
        details: `${ROOTS.DASHBOARD}/workflow/${MOCK_ID}`,
      },
      edit: (id) => `${ROOTS.DASHBOARD}/workflow/${id}/edit`,

    },

    // ////////////////////////////////////////////////////////////

  },
};
