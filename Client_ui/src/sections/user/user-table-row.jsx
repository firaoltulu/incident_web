import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { UserQuickEditForm } from './user-quick-edit-form';

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        {/* <TableCell padding="checkbox">
          <Checkbox id={row.id} checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Link color="inherit" onClick={onEditRow} sx={{ cursor: 'pointer' }}>
                {row.FirstName} {row.MiddleName} {row.LastName}
              </Link>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.Email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.PhoneNumber}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.Company.Name}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.Roles.map((role, index) => (
            <Label
              key={index}
              variant="soft"
              color={
                (role.IsActive === true && 'success') ||
                (role.IsActive === false && 'error') ||
                'default'
              }
            >
              {role.Name}
            </Label>
          ))}

        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.IsActive ? 'success' : 'warning')
            }
          >
            {row.IsActive ? 'Active' : 'InActive'}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            {/* <Tooltip title="Quick Edit" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip> */}

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            {row.IsActive ? "DeActivate" : "Activate"}
          </MenuItem>

          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to ${row.IsActive ? "DeActivate" : "Activate"}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            {row.IsActive ? "DeActivate" : "Activate"}
          </Button>
        }
      />
    </>
  );
}
