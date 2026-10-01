import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import axios from 'src/utils/axios';

// import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// import { useMockedUser } from 'src/auth/hooks';

// import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  middleName: zod.string().min(1, { message: ' Middle Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),

  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),

  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),
  company: zod.string().min(1, { message: "Company is required!" }),
  roles: zod
    .array(
      zod.object({ value: zod.string().min(1, { message: 'Role value is required!' }) })
    )
    .optional()
    .refine((v) => v === undefined || Array.isArray(v), { message: 'Roles is required!' }),
});

export function AccountGeneral({ user }) {

  // const { user } = useMockedUser();
  // const { user } = useAuthContext();

  // const URL = CONFIG.site.serverUrl;
  const [groupOptions, setGroupOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const [roleOptions, setRoleOptions] = useState([]);
  const [reloadRole, setReloadRole] = useState(false);


  const defaultValues = useMemo(
    () => ({
      firstName: user?.FirstName || '',
      middleName: user?.MiddleName || '',
      lastName: user?.LastName || '',
      email: user?.Email || '',
      phoneNumber: user?.PhoneNumber || '',
      company: user?.Company._id || '',
      roles: (user?.Roles || []).map((r) =>
        typeof r === 'string' ? { value: r, label: r } : 'value' in r ? r : { value: r._id || '', label: r.Name || '' }
      ),
    }),
    [user]
  );


  useEffect(() => {
    axios.get(`/company/list`).then((response) => {

      const groups = response.data.companies.map((group) => ({
        label: group.Name,
        value: group.id,
      }));

      setGroupOptions(groups);

    }).catch((error) => {
      setReload(!reload);
    });

  }, [ reload]);

  useEffect(() => {
    axios.get(`/role/list`).then((response) => {

      const groups = response.data.roles.map((group) => ({
        label: group.Name,
        value: group.id,
      }));

      setRoleOptions(groups);

    }).catch((error) => {
      setReloadRole(!reloadRole);
    });

  }, [reloadRole]);

  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (user) {
      reset(defaultValues);
      setReload(r => !r);
    }
  }, [user, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.put(`/auth/edit/${user.id}`, data);
      toast.success('Update success!');

    } catch (error) {
      toast.error(error?.message || 'Edit failed!');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>

          <Card sx={{ p: 3 }}>

            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Field.Text name="firstName" label="First name" />
              <Field.Text name="middleName" label="Middle name" />
              <Field.Text name="lastName" label="Last name" />

              <Field.Text name="email" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" country="ET" />
              <Field.Select name="company" label="Company">
                {groupOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>
              {/* <Field.Select name="role" label="Role">
                {roleOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select> */}

              <Field.Autocomplete
                name="roles"
                multiple
                autoHighlight
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                options={roleOptions.map((state) => ({ label: state.label, value: state.value }))}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />


            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Edit user
              </LoadingButton>
            </Stack>

          </Card>

        </Grid>

      </Grid>
    </Form>
  );
}
