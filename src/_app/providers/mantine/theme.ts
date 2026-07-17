import { createTheme, type MantineColorsTuple } from '@mantine/core'

const primary: MantineColorsTuple = [
  '#f0fdfa',
  '#ccfbf1',
  '#99f6e4',
  '#5eead4',
  '#2dd4bf',
  '#14b8a6',
  '#0d9488',
  '#0f766e',
  '#115e59',
  '#134e4a',
]

const secondary: MantineColorsTuple = [
  '#fff7ed',
  '#ffedd5',
  '#fed7aa',
  '#fdba74',
  '#fb923c',
  '#f97316',
  '#ea580c',
  '#c2410c',
  '#9a3412',
  '#7c2d12',
]

const danger: MantineColorsTuple = [
  '#fef2f2',
  '#fee2e2',
  '#fecaca',
  '#fca5a5',
  '#f87171',
  '#ef4444',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#7f1d1d',
]

export const theme = createTheme({
  primaryColor: 'primary',
  defaultRadius: 'md',
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  headings: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  },
  colors: {
    primary,
    secondary,
    danger,
  },
  components: {
    Badge: {
      defaultProps: {
        radius: 'sm',
        size: 'sm',
        variant: 'light',
      },
    },
    Button: {
      defaultProps: {
        color: 'primary',
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        p: 'md',
        radius: 'md',
        withBorder: true,
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        withBorder: true,
      },
    },
    PasswordInput: {
      defaultProps: {
        errorProps: {
          fz: 12,
          lh: 1.35,
        },
        radius: 'md',
        size: 'sm',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        errorProps: {
          fz: 12,
          lh: 1.35,
        },
        radius: 'md',
        size: 'sm',
      },
    },
  },
})
