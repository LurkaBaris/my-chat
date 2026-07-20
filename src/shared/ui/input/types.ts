import type { Control, FieldPath, FieldValues } from 'react-hook-form'

export type CustomFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  id: string
  label: string
  name: FieldPath<TFieldValues>
  required?: boolean
}
