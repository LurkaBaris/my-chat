'use client';

import { Form } from 'antd';
import Password from 'antd/es/input/Password';
import type { PasswordProps } from 'antd/es/input/Password';
import { Controller, type FieldValues } from 'react-hook-form';

import styles from './CustomInput.module.css';
import type { CustomFieldProps } from './types';

type CustomPasswordInputProps<TFieldValues extends FieldValues> = CustomFieldProps<TFieldValues> &
  Omit<PasswordProps, 'defaultValue' | 'id' | 'name' | 'onBlur' | 'onChange' | 'status' | 'value'>;

export function CustomPasswordInput<TFieldValues extends FieldValues>({
  control,
  id,
  label,
  name,
  required,
  ...inputProps
}: CustomPasswordInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);
        const errorMessage = fieldState.error?.message;

        return (
          <Form.Item
            help={errorMessage ? <span className={styles.error}>{errorMessage}</span> : undefined}
            htmlFor={id}
            label={label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
          >
            <Password
              {...inputProps}
              ref={field.ref}
              aria-invalid={hasError}
              id={id}
              name={field.name}
              status={hasError ? 'error' : undefined}
              value={field.value}
              onBlur={field.onBlur}
              onChange={field.onChange}
            />
          </Form.Item>
        );
      }}
    />
  );
}
