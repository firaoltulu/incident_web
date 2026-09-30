import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import { formatStr, parseTimeToDayjs } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export function RHFDatePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.date}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}

export function RHFTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const parsedValue = parseTimeToDayjs(field.value);

        return (
          <MobileTimePicker
            value={parsedValue}
            referenceDate={parsedValue ?? dayjs()}
            onChange={(newValue) => {
              field.onChange(
                newValue ? dayjs(newValue).format(formatStr.time) : dayjs().format(formatStr.time)
              );
            }}
            onClose={field.onBlur}
            format={formatStr.time}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message ?? slotProps?.textField?.helperText,
                onBlur: field.onBlur,
                name: field.name,
                inputRef: field.ref,
                ...slotProps?.textField,
              },
              ...slotProps,
            }}
            {...other}
          />
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFMobileDateTimePicker({ name, slotProps, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <MobileDateTimePicker
          {...field}
          value={dayjs(field.value)}
          onChange={(newValue) => field.onChange(dayjs(newValue).format())}
          format={formatStr.split.dateTime}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message ?? slotProps?.textField?.helperText,
              ...slotProps?.textField,
            },
            ...slotProps,
          }}
          {...other}
        />
      )}
    />
  );
}
