import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios from 'src/utils/axios';

import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field } from 'src/components/hook-form';
import { TableHeadCustom } from 'src/components/table';

// ----------------------------------------------------------------------


const TABLE_HEAD = [
  { id: 'state', label: 'State' },
  { id: 'doc_status', label: 'Doc Status' },
  { id: 'only_allow_edit_for', label: 'Only Allow Edit For' },
  { id: 'remove', label: '' },
];

const TABLE_HEAD_TRANSITION = [
  { id: 'state', label: 'State' },
  { id: 'action', label: 'Action' },
  { id: 'next_state', label: 'Next State' },
  { id: 'allowed', label: 'Allowed' },
  { id: 'remove', label: '' },
];

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  module: zod.string().min(1, { message: 'Module is required!' }),

  states: zod.array(zod.tuple(
    [
      zod.string(),
      zod.number(),
      zod.string(),

    ]
  )
  ),

  transition_rules: zod.array(zod.tuple(
    [
      zod.string(),
      zod.string(),
      zod.string(),
      zod.string(),

    ]
  )
  )

});

// ----------------------------------------------------------------------

export function OrderNewEditForm({ currentWorkFlow, loading }) {
  const router = useRouter();
  const URL = CONFIG.module.serverUrl;

  const [roleOptions, setRoleOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [buttonOptions, setButtonOptions] = useState([]);


  const [rows, setRows] = useState(0);
  const [Staterows, setStateRows] = useState(0);

  const [dof, setDof] = useState(0);

  const [moduleReload, setModuleReload] = useState(false);
  const [stateReload, setStateReload] = useState(false);
  const [reload, setReload] = useState(false);
  const [buttonReload, setButtonReload] = useState(false);

  const [status, setStatus] = useState(0);

  const transformStateArray = (arr) => arr.map(item => [item.state._id, item.doc_status, item.only_allow_edit_for._id]);

  const transformTransitionArray = (arr) => arr.map(item => [item.state._id, item.action._id, item.next_state._id, item.allowed._id]);

  const defaultValues = useMemo(
    () => ({
      name: currentWorkFlow?.Name || '',
      module: currentWorkFlow?.Module._id || '',
      states: transformStateArray(currentWorkFlow?.States || []) || [],
      transition_rules: transformTransitionArray(currentWorkFlow?.Transition_Rules || []) || [],

    }),
    [currentWorkFlow]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentWorkFlow?.States.length > 0 &&
      (values.states.length === currentWorkFlow?.States.length) &&
      dof === 0
    ) {
      const newSer = transformStateArray(currentWorkFlow?.States);
      setValue("states", newSer);
      setStateRows(newSer.length);
      setDof(1);
      // setStatus(newValue);

    }

    if (currentWorkFlow?.Transition_Rules.length > 0 &&
      (values.transition_rules.length === currentWorkFlow?.Transition_Rules.length) &&
      dof === 0
    ) {
      const newSer = transformTransitionArray(currentWorkFlow?.Transition_Rules);

      setValue("transition_rules", newSer);
      setRows(newSer.length);
      // setDof(1);
    }

  }, [currentWorkFlow, values, dof, setValue]);

  useEffect(() => {
    axios.get(`${URL}/role/list`).then((response) => {

      const groups = response.data.roles.map((group) => ({
        label: group.Name,
        value: group._id,
      }));

      setRoleOptions(groups);

    }).catch((error) => {
      setReload(!reload);
    });

  }, [URL, reload]);

  useEffect(() => {
    axios.get(`${URL}/modulestate/list`).then((response) => {

      const groups = response.data.moduleStates.map((group) => ({
        label: group.Name,
        value: group._id,
      }));

      setStateOptions(groups);

    }).catch((error) => {
      setStateReload(!stateReload);
    });

  }, [URL, stateReload]);

  useEffect(() => {
    axios.get(`${URL}/button/list`).then((response) => {

      const groups = response.data.buttons.map((group) => ({
        label: group.Name,
        value: group._id,
      }));

      setButtonOptions(groups);

    }).catch((error) => {
      setButtonReload(!buttonReload);
    });

  }, [URL, buttonReload]);

  useEffect(() => {

    axios.get(`${URL}/module/list`).then((response) => {

      const modules = response.data.modules.map((module) => ({
        label: module.Name,
        value: module._id,
      }));

      setModuleOptions(modules);

    }).catch((error) => {
      setModuleReload(r => !r);
    });

  }, [URL, moduleReload]);


  useEffect(() => {
    if (currentWorkFlow) {
      reset(defaultValues);
    }
  }, [currentWorkFlow, defaultValues, reset]);

  const State_COLS = 4;
  const Tran_COLS = 5;

  const State_defaultCells = Array.from({ length: Staterows }, () =>
    Array.from({ length: State_COLS }, () => "")
  );

  const defaultCells = Array.from({ length: rows }, () =>
    Array.from({ length: Tran_COLS }, () => "")
  );

  const onSubmit = handleSubmit(async (data) => {

    try {
      const newObj = {
        ...data,
        transition_rules: data.transition_rules,
        states: data.states
      };

      if (!currentWorkFlow) {

        const response = await axios.post(`${URL}/workflow/register`, newObj);
        reset();
        toast.success('Create success!');
        router.push(paths.dashboard.workflow.edit(response.data.workflow._id));
      }
      else {

        await axios.put(`${URL}/workflow/edit/${currentWorkFlow._id}`, newObj);
        toast.success('Update success!');
        // router.push(paths.dashboard.workflow.root);
      }

    } catch (error) {
      toast.error('Submit failed! Please try again.');
      console.error(error);
    }

  });

  const handleRemoving = (row) => {
    let newCells = [...values.transition_rules];

    if (row < 0 || row >= defaultCells.length) return;

    if (!Array.isArray(newCells)) {
      console.error("transition_rules is not an array");
      return;
    }
    if (row < 0 || row >= newCells.length) {
      console.error("transition_rules is not an array");
      return;
    }
    newCells = newCells.filter((_, i) => i !== row);

    setValue("transition_rules", newCells);
    setRows(rows - 1);

  }

  const handleStateRemoving = (row) => {
    let newCells = [...values.states];


    if (row < 0 || row >= State_defaultCells.length) return;

    if (!Array.isArray(newCells)) {
      console.error("states is not an array");
      return;
    }
    if (row < 0 || row >= newCells.length) {
      console.error("states is not an array");
      return;
    }
    newCells = newCells.filter((_, i) => i !== row);


    setValue("states", newCells);
    setStateRows(Staterows - 1);

  }

  const handleChangeStatus = (newValue) => {
    setStatus(newValue);
  };

  const handleChangeStatusSubmit = async () => {
    try {
      const newObj = {
        OrderID: currentWorkFlow?.OrderID,
        status
      };

      await axios.post(`${URL}/order/editstatus`, newObj);
      toast.success('Edit Status was success!');

    } catch (error) {
      toast.error('Status Edit failed! Please try again.');
      console.error(error);
    }
  };

  const renderDetails = (
    <Card>
      <CardHeader title="Work Flow Details" subheader="Work-Flow Name, docType, State..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        <Box
          columnGap={2}
          rowGap={3}
          display="grid"
          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
        >
          <Field.Text disabled={status > 0} name="name" label="Work Flow Name" />


          <Field.Select disabled={status > 0} name="module" label="Module">
            {moduleOptions.map((row) => (
              <MenuItem key={row.value} value={row.value}>
                {row.label}
              </MenuItem>
            ))}
          </Field.Select>

        </Box>

        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />

            <TableBody>

              {State_defaultCells.map((_, r) => (
                <TableRow key={r}>

                  {State_defaultCells[r].map((f_, c) => {
                    const fieldName = `states.${r}.${c}`;

                    if (c === 0) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>
                          <Field.Select disabled={status > 0} name={fieldName} label="State">
                            {stateOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }
                    if (c === 1) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="Doc Status">
                            {[0, 1, 2].map((row) => (
                              <MenuItem key={row} value={row}>
                                {row}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }
                    if (c === 2) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="Role">
                            {roleOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={c} sx={{ padding: "6px" }}>
                        <IconButton disabled={status > 0} onClick={arg => handleStateRemoving(r)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>)



                  })}


                </TableRow>
              ))}

            </TableBody>


          </Table>

        </Scrollbar>

        <Button disabled={status > 0} onClick={() => { setStateRows(Staterows + 1) }}>Add Row</Button>


      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Transition Rules"
        subheader="Rules for how states are transitions, like next state and which role is allowed to change state etc"
        sx={{ mb: 3 }}
      />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>

        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom headLabel={TABLE_HEAD_TRANSITION} />

            <TableBody>
              {defaultCells.map((_, r) => (
                <TableRow key={r}>

                  {defaultCells[r].map((f_, c) => {
                    const fieldName = `transition_rules.${r}.${c}`;

                    if (c === 0) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="State">
                            {stateOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }
                    if (c === 1) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="Action">
                            {buttonOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }
                    if (c === 2) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="State">
                            {stateOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }
                    if (c === 3) {
                      return (
                        <TableCell key={c} sx={{ padding: "6px" }}>

                          <Field.Select disabled={status > 0} name={fieldName} label="Allowed">
                            {roleOptions.map((row) => (
                              <MenuItem key={row.value} value={row.value}>
                                {row.label}
                              </MenuItem>
                            ))}
                          </Field.Select>
                        </TableCell>
                      )
                    }


                    return (
                      <TableCell key={c} sx={{ padding: "6px" }}>
                        <IconButton disabled={status > 0} onClick={arg => handleRemoving(r)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>)

                  })}


                </TableRow>
              ))}

            </TableBody>


          </Table>

        </Scrollbar>

        <Button disabled={status > 0} onClick={() => { setRows(rows + 1) }}>Add Row</Button>

      </Stack>

    </Card>

  );

  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">

      <LoadingButton disabled={status > 0} type="submit" variant="contained" size="large" loading={isSubmitting} onClick={onSubmit}>
        {!currentWorkFlow ? 'Create Work-Flow' : 'Save changes'}
      </LoadingButton>

    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 1020, xl: 980 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>
  );
}
