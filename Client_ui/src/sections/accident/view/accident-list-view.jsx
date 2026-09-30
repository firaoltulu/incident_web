import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { useGetAccident } from 'src/actions/accident';
import { DashboardContent } from 'src/layouts/dashboard';
import { useWorkflowContext } from 'src/workflow/hooks/use-workflow-context';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  rowInPage,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { AccidentTableRow } from '../accident-table-row';
import { AccidentTableToolbar } from '../accident-table-toolbar';
import { AccidentTableFiltersResult } from '../accident-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'AccidentID', label: 'Id', width: 88 },
  { id: 'company.name', label: 'company', width: 140 },
  { id: 'specific_location', label: 'Location', width: 140 },

  { id: 'incident_type', label: 'Incident Type' },
  { id: 'accident_property_damage_estimated_value', label: 'Damages Estimated Value' },
  // { id: 'statusOfCase', label: 'Status Of Case' },

  { id: 'AddedDate', label: 'AddedDate' },

  { id: '', width: 88 },
];
// const TABLE_HEAD = [
//   { id: 'AccidentID', label: 'Id', width: 88 },
//   { id: 'company.name', label: 'company', width: 140 },
//   { id: 'region', label: 'Location', width: 140 },

//   { id: 'accident_cause', label: 'Incident Cause' },
//   { id: 'incident_victim_count', label: 'Victim Count' },
//   // { id: 'statusOfCase', label: 'Status Of Case' },

//   { id: 'AddedDate', label: 'AddedDate' },

//   { id: '', width: 88 },
// ];

// ------------------------------l----------------------------------------

export function AccidentListView() {
  const table = useTable();

  const router = useRouter();

  const { accidents, accidentsLoading } = useGetAccident({
    index: table.page,
    step: table.rowsPerPage,
  });
  const { workflows, workflowsLoading } = useWorkflowContext();
  const [docWorkFlow, setDocWorkFlow] = useState(null);

  const [statusOptions, setStatusOptions] = useState([{ value: 'all', label: 'All' }]);

  const confirm = useBoolean();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (accidents.length && !workflowsLoading && docWorkFlow !== null) {
      setTableData(accidents);
    }
  }, [accidents, workflowsLoading, docWorkFlow]);

  useEffect(() => {
    const found = workflows.find((row) => row.Module._id);
    setDocWorkFlow(found);
  }, [workflows]);

  useEffect(() => {
    try {
      if (docWorkFlow !== null) {
        const Loc_States = docWorkFlow?.States.map((row) => ({
          value: row.state._id,
          label: row.state.Name,
        }));

        const uniqueLocStates = Loc_States.reduce((acc, state) => {
          if (!acc.some((item) => item.value === state.value)) {
            acc.push(state);
          }
          return acc;
        }, []);

        setStatusOptions([{ value: 'all', label: 'All' }, ...uniqueLocStates]);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [docWorkFlow]);

  const filters = useSetState({
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });
  console.log(dataFiltered);
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (accidentsLoading && !dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Delete success!');

      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.OrderID));

    toast.success('Delete success!');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.accident.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'accident', href: paths.dashboard.accident.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.accident.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Accident
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          {/* <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {statusOptions.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                      'soft'
                    }
                    color="success"
                  >
                    {['all'].includes(tab.value)
                      ? tableData.length
                      : tableData.filter((user) => user.state._id === tab.value).length}
                  </Label>
                }
              />
            ))}
          </Tabs> */}

          <AccidentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            dateError={dateError}
          />

          {canReset && (
            <AccidentTableFiltersResult
              filters={filters}
              totalResults={dataFiltered.length}
              onResetPage={table.onResetPage}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar sx={{ minHeight: 444 }}>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.OrderID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row, index) => (
                      <AccidentTableRow
                        key={index}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onDeleteRow={() => handleDeleteRow(row._id)}
                        onViewRow={() => handleViewRow(row._id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                  <TableRow>
                    {accidentsLoading ? (
                      <TableCell colSpan={12}>Loading</TableCell>
                    ) : (
                      <TableCell colSpan={12} sx={{ p: 0 }} />
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData.filter(
  //     (order) =>
  //       order.company.Name.toLowerCase().indexOf(name?.toLowerCase()) !== -1 ||
  //       order.specific_location.toLowerCase().indexOf(name?.toLowerCase()) !== -1 ||
  //       order.incident_type.toLowerCase().indexOf(name?.toLowerCase()) !== -1
  //     // order.zone.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
  //     // order.actionTaken.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }
  if (name) {
    const searchStr = name.toLowerCase();

    inputData = inputData.filter((order) => {
      // 1. Safely check nested company names
      const companyName =
        order?.company?.Name?.toLowerCase() || order?.company?.name?.toLowerCase() || '';

      // 2. Safely parse string fields with optional chaining and fallback empty strings
      // const town = order?.town?.toLowerCase() || '';
      // const worda = order?.worda?.toLowerCase() || '';
      // const zone = order?.zone?.toLowerCase() || '';
      const incident_type = order?.incident_type?.toLowerCase() || '';

      // 3. Optional: Include specific_location since it's visible in your table view
      const specificLocation = order?.specific_location?.toLowerCase() || '';

      return (
        companyName.includes(searchStr) ||
        incident_type.includes(searchStr) ||
        specificLocation.includes(searchStr)
      );
    });
  }

  if (status !== 'all') {
    inputData = inputData.filter((order) => order.state._id === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((order) => fIsBetween(order.AddedDate, startDate, endDate));
    }
  }

  return inputData;
}
