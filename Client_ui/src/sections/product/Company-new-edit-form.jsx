import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';

import axios from 'src/utils/axios';

// import { CONFIG } from 'src/config-global';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Name is required!' }),
  description: schemaHelper.editor({ message: { required_error: 'Description is required!' } }),
  parentGroup: zod.string().min(1, { message: "Parent group is required!" }),
  // .string().array().nonempty({ message: 'Choose at least one option!' }),
  // Not required
  isGroup: zod.object({ enabled: zod.boolean() }),
});

// ----------------------------------------------------------------------

export function ProductNewEditForm({ currentProduct }) {
  const router = useRouter();
  // const URL = CONFIG.site.serverUrl;
  const [groupOptions, setGroupOptions] = useState([]);
  const [reload, setReload] = useState(false);

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.Name || '',
      description: currentProduct?.Description || '',
      parentGroup: currentProduct?.ParentGroup || '',
      isGroup: { enabled: currentProduct?.IsGroup } || { enabled: false },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: zodResolver(NewProductSchema),
    defaultValues,
  });

  useEffect(() => {
    axios.get(`/company/listgroup`).then((response) => {
      const groups = response.data.companies.map((group) => ({
        label: group.Name,
        value: group.CompanyID,
      }));
      if (!currentProduct) {
        setGroupOptions(groups);
        groups.unshift({ label: 'None', value: '' });
      }
      else {
        const filteredGroups = groups.filter((row, index) => {
          if (row.value === currentProduct.CompanyID) {
            return false;
          }
          return true;
        });
        setGroupOptions(filteredGroups);
      }

    }).catch((error) => {
      setReload(r => !r);
    });

  }, [ reload, currentProduct]);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
      setReload(r => !r);
    }
  }, [currentProduct, defaultValues, reset]);




  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentProduct) {
        const response = await axios.post(`/company/register`, data);
        reset();
        toast.success(currentProduct ? 'Update success!' : 'Create success!');
      } else {
        await axios.put(`/company/edit/${currentProduct.CompanyID}`, data);
        toast.success('Update success!');
      }
    } catch (error) {
      toast.error('Submit failed! Please try again.');
      console.error(error);
    }
  });


  const renderDetails = (
    <Card>
      <CardHeader title="Details" subheader="Title, short description, Group..." sx={{ mb: 3 }} />

      <Divider />

      <Stack direction="row" alignItems="center" spacing={3}>
        <Field.Switch name="isGroup.enabled" label="Is Group" sx={{ m: 0 }} disabled={!!currentProduct} />
      </Stack>

      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="name" label="Company name" />

        <Field.Select name="parentGroup" label="Parent Company Group">
          {groupOptions.map((status) => (
            <MenuItem key={status.value} value={status.value}>
              {status.label}
            </MenuItem>
          ))}
        </Field.Select>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">About</Typography>
          <Field.Editor name="description" sx={{ maxHeight: 480 }} />
        </Stack>

      </Stack>

    </Card>
  );






  const renderActions = (
    <Stack spacing={3} direction="row" alignItems="center" flexWrap="wrap">
      {/* <FormControlLabel
        control={<Switch defaultChecked inputProps={{ id: 'publish-switch' }} />}
        label="Publish"
        sx={{ pl: 3, flexGrow: 1 }}
      /> */}

      <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
        {!currentProduct ? 'Create Company' : 'Save changes'}
      </LoadingButton>
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}

        {renderActions}
      </Stack>
    </Form>
  );
}
