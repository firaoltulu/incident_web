import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';



// ----------------------------------------------------------------------

export function RenderCellPublish({ params }) {
  return (
    <Label variant="soft" color={(params.row.IsGroup === true && 'success') || 'default'}>
      {params.row.IsGroup ? 'Group' : 'Service'}
    </Label>
  );
}

// ----------------------------------------------------------------------

export function RenderCellCreatedAt({ params }) {
  return (
    <Stack spacing={0.5}>
      <Box component="span">{fDate(params.row.AddedDate)}</Box>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.AddedDate)}
      </Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellParent({ params, onViewRow }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={params.row.ParentGroup.parentId === "" ? () => { } : onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.ParentGroup.parentLabel}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

export function RenderCellService({ params, onViewRow }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.Name}
          </Link>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
