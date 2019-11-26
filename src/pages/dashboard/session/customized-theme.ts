import {
  EuiChartThemeType,
  EUI_CHARTS_THEME_LIGHT,
  EUI_CHARTS_THEME_DARK
} from '@elastic/eui/dist/eui_charts_theme';

export const CUSTOMIZED_THEME: EuiChartThemeType = {
  // ...EUI_CHARTS_THEME_LIGHT,
  ...EUI_CHARTS_THEME_DARK,
  theme: {
    chartMargins: {
      top: 30,
      bottom: 30,
      left: 30,
      right: 30
    }
  }
};
