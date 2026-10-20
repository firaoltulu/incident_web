import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import axios from 'src/utils/axios';

import { CONFIG } from 'src/config-global';
import { useGetRoles } from 'src/actions/role';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import { ProductTableFiltersResult } from '../role-table-filters-result';
import {
  RenderCellParent,
  RenderCellPublish,
  RenderCellService,
  RenderCellCreatedAt,
} from '../role-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
// ----------------------------------------------------------------------

export function TourListView() {
  const confirmDelete = useBoolean();

  const router = useRouter();
  const { user: currentUser } = useAuthContext();
  const canDeleteRoles = currentUser?.Roles?.some(
    (role) => String(role?._id || role?.id || role) === CONFIG.role.adminRole
  );

  const { roles, rolesLoading } = useGetRoles();

  const filters = useSetState({ publish: [], stock: [] });

  const [tableData, setTableData] = useState([]);

  const [roleToDelete, setRoleToDelete] = useState(null);
  const [isDeletingRole, setIsDeletingRole] = useState(false);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (roles.length) {
      setTableData(roles);
    }
  }, [roles]);


  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleDeleteRow = useCallback(async () => {
    if (!canDeleteRoles || !roleToDelete || isDeletingRole) return;

    setIsDeletingRole(true);
    try {
      await axios.delete(`/role/delete/${roleToDelete.id}`);
      setTableData((rows) => rows.filter((row) => row.id !== roleToDelete.id));
      toast.success('Role deleted successfully.');
      confirmDelete.onFalse();
      setRoleToDelete(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete role.');
    } finally {
      setIsDeletingRole(false);
    }
  }, [canDeleteRoles, confirmDelete, isDeletingRole, roleToDelete]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.role.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.role.edit(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state]
  );

  const columns = [
    {
      field: 'Name',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => (
        <RenderCellService params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'Discription',
      headerName: 'Discription',
      width: 160,
      type: 'singleSelect',
      renderCell: (params) => <RenderCellParent params={params} onViewRow={() => handleViewRow(params.row.ParentGroup.parentId)} />,
    },
    {
      field: 'IsActive',
      headerName: 'Is Active',
      width: 110,
      type: 'singleSelect',
      editable: true,
      renderCell: (params) => <RenderCellPublish params={params} />,
    },
    {
      field: 'AddedDate',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          disabled={String(params.row.id) === CONFIG.role.adminRole}
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          disabled={!canDeleteRoles}
          onClick={() => {
            setRoleToDelete(params.row);
            confirmDelete.onTrue();
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns.filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field)).map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'role', href: paths.dashboard.role.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.role.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Role
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >

          <DataGrid
            checkboxSelection={false}
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={rolesLoading}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />

        </Card>

      </DashboardContent>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          setRoleToDelete(null);
        }}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{roleToDelete?.Name}</strong>? Roles associated
            with users or workflows cannot be deleted.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRow}
            disabled={isDeletingRole}
          >
            {isDeletingRole ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />

    </>
  );

}

function CustomToolbar({
  filters,
  canReset,
  filteredResults,
  setFilterButtonEl,
}) {
  return (
    <>
      <GridToolbarContainer>

        {/* <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        /> */}

        <GridToolbarQuickFilter />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Stack>

      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const { stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }

  return inputData;
}
