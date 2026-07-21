import type { ThemeConfig } from 'antd'

const primary = [
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

const secondary = [
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

const danger = [
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

export const antdTheme = {
  cssVar: {
    key: 'chat-app-theme',
    prefix: 'chat',
  },
  token: {
    colorPrimary: primary[6],
    colorPrimaryBg: primary[0],
    colorPrimaryBgHover: primary[1],
    colorPrimaryBorder: primary[2],
    colorPrimaryBorderHover: primary[3],
    colorPrimaryHover: primary[5],
    colorPrimaryActive: primary[7],
    colorPrimaryTextHover: primary[5],
    colorPrimaryText: primary[6],
    colorPrimaryTextActive: primary[8],

    colorInfo: primary[6],
    colorInfoBg: primary[0],
    colorInfoBgHover: primary[1],
    colorInfoBorder: primary[2],
    colorInfoBorderHover: primary[3],

    colorWarning: secondary[5],
    colorWarningBg: secondary[0],
    colorWarningBgHover: secondary[1],
    colorWarningBorder: secondary[2],
    colorWarningBorderHover: secondary[3],

    colorError: danger[6],
    colorErrorBg: danger[0],
    colorErrorBgHover: danger[1],
    colorErrorBorder: danger[2],
    colorErrorBorderHover: danger[3],
    colorErrorHover: danger[5],
    colorErrorActive: danger[7],

    colorLink: primary[7],
    colorLinkHover: primary[6],
    colorLinkActive: primary[8],

    colorText: '#172b29',
    colorTextSecondary: '#5f6f6d',
    colorBgLayout: primary[0],
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBorder: '#cce5e1',
    colorBorderSecondary: '#e5efed',

    borderRadius: 8,
    controlHeight: 34,
    fontSize: 14,
    boxShadowSecondary: '0 1px 3px rgba(19, 78, 74, 0.08), 0 8px 24px rgba(19, 78, 74, 0.06)',
  },
  components: {
    Alert: {
      defaultPadding: '6px 10px',
      withDescriptionIconSize: 16,
      withDescriptionPadding: '8px 10px',
    },
    Button: {
      defaultShadow: 'none',
      dangerShadow: 'none',
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Card: {
      bodyPadding: 24,
      bodyPaddingSM: 20,
    },
    Form: {
      itemMarginBottom: 8,
      labelFontSize: 13,
      labelHeight: 24,
      verticalLabelPadding: '0 0 2px',
    },
    Notification: {
      colorErrorBg: danger[0],
      colorInfoBg: primary[0],
      colorSuccessBg: primary[0],
      colorWarningBg: secondary[0],
      width: 340,
    },
  },
} satisfies ThemeConfig
