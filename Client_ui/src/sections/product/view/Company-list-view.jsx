import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import { TreeItem, SimpleTreeView } from '@mui/x-tree-view';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
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
import { useGetCompanies } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useAuthContext } from 'src/auth/hooks';

import { ProductTableFiltersResult } from '../Company-table-filters-result';
import {
  RenderCellParent,
  RenderCellPublish,
  RenderCellService,
  RenderCellCreatedAt,
} from '../Company-table-row';

// ----------------------------------------------------------------------

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];
// ----------------------------------------------------------------------

export function ProductListView() {
  const confirmDelete = useBoolean();

  const router = useRouter();
  const { user: currentUser } = useAuthContext();
  const canDeleteCompanies = currentUser?.Roles?.some(
    (role) => String(role?._id || role?.id || role) === CONFIG.role.adminRole
  );

  const { companies, companiesLoading } = useGetCompanies();

  const filters = useSetState({ publish: [], stock: [] });

  const [tableData, setTableData] = useState([]);
  const [viewMode, setViewMode] = useState('list');

  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);

  const [parentGroups, setParentGroups] = useState([]);


  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  useEffect(() => {
    if (companies.length) {
      setTableData(companies);
      const parent_groups = companies.filter((row) => {
        if (row.IsGroup) {
          return row;
        }
        return null;
      }).map((row) => ({ value: row.Name, label: row.Name })
      );

      setParentGroups(parent_groups)
    }
  }, [companies]);


  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const companyTree = useMemo(() => buildCompanyTree(dataFiltered), [dataFiltered]);

  const handleDeleteRow = useCallback(async () => {
    if (!canDeleteCompanies || !companyToDelete || isDeletingCompany) return;

    setIsDeletingCompany(true);
    try {
      await axios.delete(`/company/delete/${companyToDelete.id}`);
      setTableData((rows) => rows.filter((row) => row.id !== companyToDelete.id));
      toast.success('Company deleted successfully.');
      confirmDelete.onFalse();
      setCompanyToDelete(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete company.');
    } finally {
      setIsDeletingCompany(false);
    }
  }, [canDeleteCompanies, companyToDelete, confirmDelete, isDeletingCompany]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.service.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.service.edit(id));
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
      headerName: 'Company Name',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => (
        <RenderCellService params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'ParentGroup',
      headerName: 'Parent Group',
      width: 160,
      type: 'singleSelect',
      valueOptions: parentGroups, // <-- your options here
      valueGetter: (params) => params?.parentLabel || '',
      renderCell: (params) => <RenderCellParent params={params} onViewRow={() => handleViewRow(params.row.ParentGroup?.parentId)} />,
    },
    {
      field: 'IsGroup',
      headerName: 'Is Group',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: [true, false],
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
          onClick={() => handleEditRow(params.row.id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          disabled={!canDeleteCompanies}
          onClick={() => {
            setCompanyToDelete(params.row);
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
            { name: 'Company', href: paths.dashboard.service.root },
            { name: 'List' },
          ]}
          action={
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1}>
              <ToggleButtonGroup
                size="small"
                value={viewMode}
                exclusive
                aria-label="Company view"
                onChange={(event, nextView) => {
                  if (nextView) setViewMode(nextView);
                }}
                sx={{ '& .MuiToggleButton-root': { minHeight: 40, px: 2 } }}
              >
                <ToggleButton value="list" aria-label="List view">
                  List
                </ToggleButton>
                <ToggleButton value="tree" aria-label="Tree view">
                  Tree
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                component={RouterLink}
                href={paths.dashboard.service.new}
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
              >
                New Company
              </Button>
            </Stack>
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

          {viewMode === 'list' ? (
            <DataGrid
              checkboxSelection={false}
              disableRowSelectionOnClick
              rows={dataFiltered}
              columns={columns}
              loading={companiesLoading}
              getRowHeight={() => 'auto'}
              pageSizeOptions={[20, 100, 200]}
              initialState={{ pagination: { paginationModel: { pageSize: 20 } } }}
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
          ) : (
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {companiesLoading ? (
                <EmptyContent title="Loading companies..." />
              ) : companyTree.length ? (
                <SimpleTreeView
                  aria-label="Company hierarchy"
                  defaultExpandedItems={companyTree.map((node) => node.id)}
                >
                  {companyTree.map((node) => renderCompanyTreeNode(node, handleViewRow))}
                </SimpleTreeView>
              ) : (
                <EmptyContent title="No companies found" />
              )}
            </Box>
          )}

        </Card>

      </DashboardContent>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={() => {
          confirmDelete.onFalse();
          setCompanyToDelete(null);
        }}
        title="Delete"
        content={
          <>
            Are you sure you want to delete <strong>{companyToDelete?.Name}</strong>? Companies
            associated with users, accidents, or child companies cannot be deleted.
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRow}
            disabled={isDeletingCompany}
          >
            {isDeletingCompany ? 'Deleting...' : 'Delete'}
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

function buildCompanyTree(companies) {
  const nodes = companies.map((company) => ({
    company,
    id: String(company.id || company._id),
    parentId: String(company.ParentGroup?.parentId || ''),
    children: [],
  }));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const roots = [];

  nodes.forEach((node) => {
    const parent = nodesById.get(node.parentId);

    if (parent && parent.id !== node.id) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  const visitedIds = new Set();
  const markVisited = (node) => {
    if (visitedIds.has(node.id)) return;
    visitedIds.add(node.id);
    node.children.forEach(markVisited);
  };

  roots.forEach(markVisited);
  nodes.forEach((node) => {
    if (!visitedIds.has(node.id)) {
      roots.push(node);
      markVisited(node);
    }
  });

  return roots;
}

function renderCompanyTreeNode(node, onViewRow, renderedIds = new Set()) {
  if (renderedIds.has(node.id)) return null;
  renderedIds.add(node.id);

  return (
    <TreeItem
      key={node.id}
      itemId={node.id}
      label={
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Link
            component="button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onViewRow(node.id);
            }}
            sx={{
              color: 'text.primary',
              cursor: 'pointer',
              textAlign: 'left',
              typography: 'body2',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {node.company.Name}
          </Link>
          <Typography variant="caption" color="text.secondary">
            {node.company.IsGroup ? 'Group' : 'Company'}
          </Typography>
        </Stack>
      }
    >
      {node.children.map((child) => renderCompanyTreeNode(child, onViewRow, renderedIds))}
    </TreeItem>
  );
}
