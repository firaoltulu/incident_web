import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha, stylesMode } from 'src/theme/styles';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HelpMe() {
  const theme = useTheme();

  return (
    <Container component={MotionViewport} sx={{ py: { xs: 10, md: 15 }, textAlign: { xs: 'center', md: 'unset' } }}>

      <Grid container columnSpacing={{ md: 3 }} alignItems="flex-start">
        {/* <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={`${CONFIG.site.basePath}/assets/images/help-me/first/first.png`}
                ratio="1/1"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.74)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={`${CONFIG.site.basePath}/assets/images/help-me/first/second.png`}
                ratio="14/4"
                sx={{
                  borderRadius: 1,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.74)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              How Can We Help You?
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
            >
              First Step get email and password from administrator to access the platform navigate to the sign-in page by clicking the button.
            </Typography>
          </m.div>
        </Grid> */}
      </Grid>

      <Grid container columnSpacing={{ md: 3 }} sx={{ marginTop: 20 }} alignItems="flex-start">
        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              When Trying To Login?
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
            >
              When You try to Login and u receives a warning like the image shown it means you provide a wrong email or password.
            </Typography>
          </m.div>
        </Grid>

        <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={`${CONFIG.site.basePath}/assets/images/help-me/second/second.png`}
                ratio="16/4"
                sx={{
                  borderRadius: 1,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.74)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={`${CONFIG.site.basePath}/assets/images/help-me/second/first.png`}
                ratio="1.6/2"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.54)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid>

      </Grid>

      <Grid container columnSpacing={{ md: 3 }} sx={{ marginTop: 20 }} alignItems="flex-start">
        <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={`${CONFIG.site.basePath}/assets/images/help-me/third/first.png`}
                ratio="1/1"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.44)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={`${CONFIG.site.basePath}/assets/images/help-me/third/second.png`}
                ratio="1.3/2"
                sx={{
                  borderRadius: 1,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.74)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid>

        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Navigating the dashboard?
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
            >
              After Successfully Login. Navigate To The Accident Management tab to register a new Incident navigate to the create tab
            </Typography>
          </m.div>
        </Grid>

      </Grid>

      <Grid container columnSpacing={{ md: 3 }} sx={{ marginTop: 20 }} alignItems="flex-start">
        <Grid xs={12} md={6} lg={5}>
          <m.div variants={varFade().inRight}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Registering A New Accident?
            </Typography>
          </m.div>

          <m.div variants={varFade().inRight}>
            <Typography
              sx={{ color: 'text.secondary', [stylesMode.dark]: { color: 'common.white' } }}
            >
              When You try to register a new Accident and u get the following error in the image it means that you need to input some values before clicking the save button.
            </Typography>
          </m.div>
        </Grid>

        <Grid
          container
          xs={12}
          md={6}
          lg={7}
          alignItems="center"
          sx={{
            pr: { md: 7 },
            display: { xs: 'none', md: 'flex' },
          }}
        >
          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office large"
                src={`${CONFIG.site.basePath}/assets/images/help-me/four/second.png`}
                ratio="1/2"
                sx={{
                  borderRadius: 1,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.74)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.24)}`,
                  },
                }}
              />
            </m.div>
          </Grid>

          <Grid xs={6}>
            <m.div variants={varFade().inUp}>
              <Image
                alt="Our office small"
                src={`${CONFIG.site.basePath}/assets/images/help-me/four/first.png`}
                ratio="1.1/2"
                sx={{
                  borderRadius: 3,
                  boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.54)}`,
                  [stylesMode.dark]: {
                    boxShadow: `-40px 40px 80px ${varAlpha(theme.vars.palette.common.blackChannel, 0.74)}`,
                  },
                }}
              />
            </m.div>
          </Grid>
        </Grid>

      </Grid>

    </Container >
  )

}
