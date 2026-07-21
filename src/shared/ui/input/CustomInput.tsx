'use client'

import { Form } from 'antd'
import Input from 'antd/es/input/Input'
import type { InputProps } from 'antd/es/input/Input'
import { Controller, type FieldValues } from 'react-hook-form'

import styles from './CustomInput.module.css'
import type { CustomFieldProps } from './types'

type CustomInputProps<TFieldValues extends FieldValues> = CustomFieldProps<TFieldValues> &
  Omit<InputProps, 'defaultValue' | 'id' | 'name' | 'onBlur' | 'onChange' | 'status' | 'value'>

export function CustomInput<TFieldValues extends FieldValues>({
  control,
  id,
  label,
  name,
  required,
  ...inputProps
}: CustomInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error)
        const errorMessage = fieldState.error?.message

        return (
          <Form.Item
            help={errorMessage ? <span className={styles.error}>{errorMessage}</span> : undefined}
            htmlFor={id}
            label={label}
            required={required}
            validateStatus={hasError ? 'error' : undefined}
          >
            <Input
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
        )
      }}
    />
  )
}
