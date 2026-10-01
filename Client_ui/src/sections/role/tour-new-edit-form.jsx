import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios from 'src/utils/axios';

// import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------


export const NewRoleSchema = zod
  .object({
    name: zod.string().min(1, { message: 'Name is required!' }),
    description: zod.string().min(1, { message: 'Description is required!' }),
    isActive: zod.object({ enabled: zod.boolean() }),
    modules: zod
      .array(
        zod.object({ value: zod.string().min(1, { message: 'Modules value is required!' }) })
      )
      .optional()
      .refine((v) => v === undefined || Array.isArray(v), { message: 'Modules is required!' }),
  });
export function TourNewEditForm({ currentRole }) {
  const router = useRouter();
  // const URL = CONFIG.site.serverUrl;

  const [groupModules, setGroupModules] = useState([]);
  const [reload, setReload] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentRole?.Name || '',
      description: currentRole?.Description || '',
      isActive: { enabled: currentRole?.IsActive || false },
      modules: (currentRole?.Modules || []).map((m) =>
        typeof m === 'string' ? { value: m, label: m } : 'value' in m ? m : { value: m._id || '', label: m.Name || '' }
      ),
    }),
    [currentRole]
  );


  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(NewRoleSchema),
    defaultValues,
  });

  useEffect(() => {

    axios.get(`/module/list`).then((response) => {

      const modules = response.data.modules.map((module) => ({
        label: module.Name,
        value: module._id,
        Description: module.Description,
      }));

      setGroupModules(modules);

    }).catch((error) => {
      setReload(r => !r);
    });

  }, [reload]);

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    // if (currentRole) {
    reset(defaultValues);
    // }
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentRole) {
        const response = await axios.post(`/role/register`, data);
        reset();
        toast.success('Create success!');
        router.push(paths.dashboard.role.edit(response.data.role._id));
      }
      else {
        await axios.put(`/role/edit/${currentRole.id}`, data);
        toast.success('Update success!');
      }
    } catch (error) {
      toast.error(error.message || 'failed!');
      console.error(error);
    }
  });


  const renderDetails = (
    <Card>

      <CardHeader title="Details" subheader="Name, isActive..." sx={{ mb: 3 }} />

      <Divider />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Name</Typography>
          <Field.Text name="name" placeholder="Ex: Approver, Head of Department..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description</Typography>
          <Field.Text name="description" placeholder="Ex: a user assign this role..." />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={3}>
          <Field.Switch name="isActive.enabled" label="Is Active" sx={{ m: 0 }} disabled={!!currentRole} />
        </Stack>

      </Stack>

    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Permissions & Attributes"
        subheader="Additional functions and attributes..."
        sx={{ mb: 3 }}
      />

      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>

        <Field.Autocomplete
          name="modules"
          multiple
          autoHighlight
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          options={groupModules.map((state) => ({ label: state.label, value: state.value }))}
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
        />

      </Stack>

    </Card>

  );

  const renderActions = (
    <Stack direction="row" alignItems="center" flexWrap="wrap">

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentRole ? 'Create Role' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (

    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Stack>
    </Form>

  );

}
