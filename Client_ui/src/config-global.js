import { paths } from 'src/routes/paths';

import packageJson from '../package.json';

// -----------------------------------------------------------------------

export const CONFIG = {
  site: {
    name: 'Midroc',
    serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
    assetURL: import.meta.env.VITE_ASSET_URL ?? '',
    basePath: import.meta.env.VITE_BASE_PATH ?? '',
    version: packageJson.version,

  },
  module: {
    accidentModule: import.meta.env.VITE_ACCIDENT_MODULE_KEY ?? '',
    userModule: import.meta.env.VITE_ACCIDENT_USER_KEY ?? '',
    companyModule: import.meta.env.VITE_ACCIDENT_COMPANY_KEY ?? '',
    roleModule: import.meta.env.VITE_ACCIDENT_ROLE_KEY ?? '',
    workflowModule: import.meta.env.VITE_ACCIDENT_WORKFLOW_KEY ?? '',

  },
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Mapbox
   */
  mapbox: {
    apiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
  },
};
