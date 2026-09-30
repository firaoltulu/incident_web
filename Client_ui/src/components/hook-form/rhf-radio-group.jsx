import { Controller, useFormContext } from 'react-hook-form';

import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export function RHFRadioGroup({
  name,
  label,
  options,
  helperText,
  slotProps,
  disabled = false,
  sx,
  ...other
}) {
  const { control } = useFormContext();

  const labelledby = `${name}-radio-buttons-group-label`;
  const ariaLabel = (val) => `Radio ${val}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" disabled={disabled} sx={slotProps?.wrap}>
          {label && (
            <FormLabel
              id={labelledby}
              component="legend"
              {...slotProps?.formLabel}
              sx={{ mb: 1, typography: 'body2', ...slotProps?.formLabel?.sx }}
            >
              {label}
            </FormLabel>
          )}

          <RadioGroup
            {...field}
            {...other}
            aria-labelledby={labelledby}
            disabled={disabled}
            sx={{
              ...(disabled && { pointerEvents: 'none', opacity: 0.72 }),
              ...sx,
            }}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                disabled={disabled}
                slotProps={{
                  typography: {
                    sx: {
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      lineHeight: 1.3,
                      ...slotProps?.formControlLabel?.sx,
                    },
                  },
                }}
                control={
                  <Radio
                    disabled={disabled}
                    size="small"
                    {...slotProps?.radio}
                    inputProps={{
                      ...(!option.label && { 'aria-label': ariaLabel(option.label) }),
                      ...slotProps?.radio?.inputProps,
                    }}
                  />
                }
                label={option.label}
              />
            ))}
          </RadioGroup>

          {(!!error || helperText) && (
            <FormHelperText error={!!error} sx={{ mx: 0 }} {...slotProps?.formHelperText}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
