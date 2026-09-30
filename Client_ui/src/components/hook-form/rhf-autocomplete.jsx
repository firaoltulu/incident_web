import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

export function RHFAutocomplete({ name, label, helperText, hiddenLabel, placeholder, ...other }) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value ?? (other?.multiple ? [] : null);

        return (
          <Autocomplete
            {...field}
            id={`rhf-autocomplete-${name}`}
            value={value}
            onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error?.message : helperText}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password',
                }}
              />
            )}
            {...other}
          />
        );
      }}
    />
  );
}
