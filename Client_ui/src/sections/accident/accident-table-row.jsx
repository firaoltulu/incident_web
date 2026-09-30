import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

const shortId = (id, length = 8) => (id ? `${id.slice(0, length)}...` : '');

// ----------------------------------------------------------------------

export function AccidentTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();

  const collapse = useBoolean();

  const popover = usePopover();

  const short = shortId(row._id, 8);

  console.log('*****row********');
  console.log(row);
  console.log('*****row********');
  const renderPrimary = (
    <TableRow hover selected={selected}>
      {/* <TableCell padding="checkbox">
        <Checkbox
          checked={selected}
          onClick={onSelectRow}
          inputProps={{ id: `row-checkbox-${row._id}`, 'aria-label': `Row checkbox` }}
        />
      </TableCell> */}

      <TableCell>
        <Link color="inherit" onClick={onViewRow} underline="always" sx={{ cursor: 'pointer' }}>
          {short}
        </Link>
      </TableCell>

      <TableCell> {row.company.Name} </TableCell>

      <TableCell>
        <Stack spacing={2} direction="row" alignItems="center">
          <Stack
            sx={{
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Box component="span">{row.specific_location}</Box>
            {/* <Box component="span" sx={{ color: 'text.disabled' }}>
              {row.zone}
            </Box> */}
          </Stack>
        </Stack>
      </TableCell>

      <TableCell align="center"> {row.incident_type} </TableCell>

      {/* <TableCell align="center">{row.accident_property_damage_estimated_value}</TableCell> */}
      <TableCell align="center">
        {row.incident_type === 'አደጋ'
          ? row.accident_property_damage_estimated_value
          : row.damaged_property_estimated_value}
      </TableCell>

      {/* <TableCell>
        <Label
          variant="soft"
          color={
            (row.statusOfCase === 'under administrative' && 'success') ||
            (row.statusOfCase === 'Under investigation' && 'default') ||
            (row.statusOfCase === 'none' && 'error') ||
            'default'
          }
        >
          {row.statusOfCase}
        </Label>
      </TableCell> */}

      <TableCell>
        <ListItemText
          primary={fDate(row.AddedDate)}
          secondary={fTime(row.AddedDate)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Paper sx={{ m: 1.5 }}>
            {row.stateHistory
              .slice()
              .reverse()
              .map((item, index) => (
                <Stack
                  key={index}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 1.5, 1.5, 5.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  }}
                >
                  <ListItemText
                    primary={item.by.FirstName}
                    secondary={item.by.MiddleName}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      // component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <ListItemText
                    primary={item.state.Name}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <ListItemText
                    primary={fDate(item.date)}
                    secondary={fTime(item.date)}
                    primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                    secondaryTypographyProps={{
                      mt: 0.5,
                      component: 'span',
                      typography: 'caption',
                    }}
                  />
                  {/* <ListItemText
                  primary={item.Remarks}
                  align="center"

                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                /> */}
                </Stack>
              ))}
          </Paper>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {/* <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem> */}

          <MenuItem
            onClick={() => {
              onViewRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
