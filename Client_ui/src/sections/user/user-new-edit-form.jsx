import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

// import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First name is required!' }),
  middleName: zod.string().min(1, { message: ' Middle Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last name is required!' }),

  userEmail: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),

  phoneNumber: schemaHelper.phoneNumber({ isValidPhoneNumber }),

  company: zod.string().min(1, { message: "Company is required!" }),

  defaultPassword: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),

  // role: zod.string().min(1, { message: 'Role is required!' }),
  // Not required
});

// -----------------------------------------------------------------------

export function UserNewEditForm() {
  const router = useRouter();
  // const URL = CONFIG.site.serverUrl;
  const [groupOptions, setGroupOptions] = useState([]);
  const [reload, setReload] = useState(false);


  const password = useBoolean();

  const defaultValues = {
    firstName: '',
    middleName: '',
    lastName: '',
    userEmail: '',
    phoneNumber: '',
    company: '',
    defaultPassword: '',
    // role: '',
  };

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

  }, [reload]);


  const methods = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await axios.post(`/auth/register`, data);
      reset();
      toast.success('Create success!');

    } catch (error) {
      toast.error(error?.message || 'Create failed!');
    }
  });


  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>

        {/* <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>

            <Box sx={{ mb: 5 }}>
              <Field.UploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <Field.Switch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid> */}

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

              <Field.Text name="userEmail" label="Email address" />
              <Field.Phone name="phoneNumber" label="Phone number" country="ET" />
              <Field.Select name="company" label="Company">
                {groupOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Field.Select>

              <Field.Text
                name="defaultPassword"
                label="Password"
                placeholder="6+ characters"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Field.CountrySelect
                fullWidth
                name="country"
                label="Country"
                placeholder="Choose a country"
              /> */}

              {/* <Field.Text name="role" label="Role" /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Create user
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
