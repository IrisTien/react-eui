import { Component } from "react";
import { Chart, BarSeries, Axis, Settings, LineSeries, getSpecId, getAxisId } from "@elastic/charts";
import { colorPalette } from "@elastic/eui";
import React from "react";
import { EUI_CHARTS_THEME_LIGHT } from "@elastic/eui/dist/eui_charts_theme";
import UserService from "../../services/user_service";

export class DemoBarChart extends Component {
  state = {
    chartType: 'LineSeries',
    data1: [],
    data2: []
  };

  componentDidMount() {
    UserService.getInfo()
    .then((res: any) => {
      this.setState({
        data2: res
      });
    });

    UserService.getLineChartData()
    .then((res: any) => {
      this.setState({
        data1: res
      });
    });
  }

  render() {
    const theme = EUI_CHARTS_THEME_LIGHT.theme;

    const customColors = {
      colors: {
        vizColors: colorPalette('#FFFFE0', '#017F75', 5),
      },
    };

    const data1CustomSeriesColors = new Map();
    const data1DataSeriesColorValues = {
      colorValues: [],
      specId: 'demo-line-series',
    };
    data1CustomSeriesColors.set(data1DataSeriesColorValues, 'black');

    return (
        <Chart size={{ height: 200 }}>
          <Settings
            theme={[customColors, theme]}
            showLegend={false}
            showLegendDisplayValue={false}
          />
          <BarSeries
            name="Status"
            data={this.state.data2}
            xAccessor={'x'}
            yAccessors={['y']}
            splitSeriesAccessors={['g']}
            stackAccessors={['g']}
          />
          <LineSeries
            id={getSpecId('demo-line-series')}
            name="Control"
            data={this.state.data1}
            xAccessor={'x'}
            yAccessors={['y']}
            customSeriesColors={data1CustomSeriesColors}
          />
          <Axis id={getAxisId('demo-bottom-axis')} position="bottom" showGridLines />
          <Axis id={getAxisId('demo-left-axis')} position="left" showGridLines />
        </Chart>
    );
  }
}