import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';

// import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AccidentDetailsToolbar({
  backLink,
  createdAt,
  orderNumber,
  correctStatus,
  actions,
  handleWorkflowAction,
  actionLoading = {},
}) {
  // const shortId = (id, length = 8) => id ? id.slice(0, length) + '...' : '';

  const shortId = (id, length = 8) => (id ? `${id.slice(0, length)}...` : '');

  const short = shortId(orderNumber, 8);

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} sx={{ mb: { xs: 3, md: 5 } }}>
      <Stack spacing={1} direction="row" alignItems="flex-start">
        <IconButton component={RouterLink} href={backLink}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Stack spacing={0.5}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Typography variant="h4"> Accident {short} </Typography>
            {/* <Label
              variant="soft"
              color='success'
            >
              {correctStatus.Name}
            </Label> */}
          </Stack>

          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            {fDateTime(createdAt)}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        flexGrow={0.9}
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
      >
        {actions.map((a) => (
          <LoadingButton
            type="button"
            size="large"
            loading={!!actionLoading[a.actionId._id]}
            variant="outlined"
            key={a.actionId._id}
            onClick={() => handleWorkflowAction(a)}
            sx={{ textTransform: 'capitalize', color: a.actionColor }}
          >
            {a.actionName}
          </LoadingButton>
        ))}
      </Stack>
    </Stack>
  );
}
