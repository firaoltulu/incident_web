import 'src/global.css';

// ----------------------------------------------------------------------
import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { LocalizationProvider } from 'src/locales';
import { I18nProvider } from 'src/locales/i18n-provider';
import { ThemeProvider } from 'src/theme/theme-provider';
import { ButtonProvider } from 'src/button/context/button-provider';
import { WorkflowProvider } from 'src/workflow/context/workflow-provider';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

const AuthProvider = JwtAuthProvider;

export default function App() {
  useScrollToTop();

  return (
    <I18nProvider>
      <LocalizationProvider>
        <AuthProvider>
          <WorkflowProvider>
            <ButtonProvider>
              <SettingsProvider settings={defaultSettings}>
                <ThemeProvider>
                  <MotionLazy>
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer hideCompact hideFont hidePresets hideNavColor hideContrast />
                    <Router />
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </ButtonProvider>
          </WorkflowProvider>

        </AuthProvider>
      </LocalizationProvider>
    </I18nProvider>
  );
}
