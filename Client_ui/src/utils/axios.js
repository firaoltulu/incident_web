import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/auth/me',
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  company: {
    list: '/company/list',
    details: '/company/details/:companyId',
    search: '/company/search',
  },
  workflow: {
    list: '/workflow/list',
    details: '/workflow/details/:workflowId',
    search: '/workflow/search',
  },
  button: {
    list: '/button/list',
    details: '/button/details/:buttonId',
    search: '/button/search',
  },
  accident: {
    list: '/accident/list',
    details: '/accident/details/:accidentId',
    search: '/accident/search',
  },
  user: {
    list: '/auth/list',
    details: '/auth/details/:userId',
    search: '/auth/search',
  },
  role: {
    list: '/role/list',
    details: '/role/details/:roleId',
    search: '/role/search',
  },
  order: {
    list: '/order/list',
    details: '/order/details',
    search: '/order/search',
  },
};
