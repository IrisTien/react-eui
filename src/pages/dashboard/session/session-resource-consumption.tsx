import { FC, useState } from 'react';
import React from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiStat,
  EuiFormRow,
  EuiSelect
} from '@elastic/eui';
import {
  Chart,
  LineSeries,
  getSpecId,
  getAxisId,
  Axis,
  timeFormatter,
  niceTimeFormatByDay,
  Settings,
  BarSeries,
  getGroupId
} from '@elastic/charts';
import { isNumber } from 'lodash';
import ReactApexChart from 'react-apexcharts';

type SessionResourcePropsType = {
  counts: {
    sessions?: number;
    desktopSessions?: number;
    applicationSessions?: number;
  };
  trendData: {
    resourceTrend?: any[];
    totalTrend?: any[];
    desktopTrend?: any[];
    applicationTrend?: any[];
    podData?: any[];
  };
  barData?: any[];
  pieData?: any[];
  fetchData: Function;
};

const DashboardSessionResouceConsumption: FC<SessionResourcePropsType> = props => {
  const resourceOptions = [
    {
      value: 'CPU',
      text: 'CPU'
    },
    {
      value: 'MEMORY',
      text: 'Memory'
    },
    {
      value: 'DISK',
      text: 'Disk IOPS'
    }
  ];

  const deploymentOptions = [
    {
      value: 'Azure',
      text: 'Microsoft Azure'
    },
    {
      value: 'on-prem',
      text: 'On-Prem'
    }
  ];

  const defaultPieOptions = {
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true
            },
            value: {
              show: true
            }
          }
        }
      }
    },
    responsive: [
      {
        options: {
          legend: {
            show: false
          }
        }
      }
    ],
    theme: {
      palette: 'palette10'
    },
    legend: {
      position: 'bottom'
    }
  };

  const [resourceType, setResourceType] = useState(resourceOptions[0].value);
  const [deployment, setDeployment] = useState(deploymentOptions[0].value);

  const onResourceTypeSelect = (e: any) => {
    e.preventDefault();
    props.fetchData(e.target.value, deployment);
    setResourceType(e.target.value);
  };

  const onDeploymentSelect = (e: any) => {
    props.fetchData(resourceType, e.target.value);
    setDeployment(e.target.value);
  };

  const renderSummaryChart = () => {
    if (deployment === 'Azure') {
      return (
        <Chart id="pod-session-bar-chart">
          <Settings rotation={90} />
          <BarSeries
            id={getSpecId('pod-session-series')}
            xScaleType="linear"
            yScaleType="linear"
            xAccessor="index"
            yAccessors={['session']}
            splitSeriesAccessors={['pod']}
            data={props.barData || []}
          />
          <Axis
            id={getAxisId('resource-consumption-bar-left-axis')}
            tickFormat={() => ''}
          />
          <Axis
            id={getAxisId('resource-consumption-bar-bottom-axis')}
            position="bottom"
          />
        </Chart>
      );
    } else {
      const labels = (props.pieData || []).map(item => item.podName);
      const series = (props.pieData || []).map(item => item.resourceValue);
      console.log(labels);
      console.log(series);
      return (
        <div style={{ marginTop: 50 }}>
          <ReactApexChart
            options={{ ...defaultPieOptions, labels: labels }}
            series={series}
            type="donut"
            width="300"
            height="300"
          />
        </div>
      );
    }
  };

  return (
    <EuiPanel paddingSize="m" hasShadow>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size="xs" className="mui-header">
            <h1>Resource Consumption</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow>
            <EuiSelect
              options={resourceOptions}
              value={resourceType}
              onChange={onResourceTypeSelect}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow>
            <EuiSelect
              options={deploymentOptions}
              value={deployment}
              onChange={onDeploymentSelect}
            />
          </EuiFormRow>
        </EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup>
        <EuiFlexItem grow={3}>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiStat
                title={
                  isNumber(props.counts.sessions) ? props.counts.sessions : 'NA'
                }
                titleSize="s"
                description="Total Sessions"
                textAlign="center"
                reverse={true}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiStat
                title={
                  isNumber(props.counts.desktopSessions)
                    ? props.counts.desktopSessions
                    : 'NA'
                }
                titleSize="s"
                description="Desktop Sessions"
                textAlign="center"
                reverse={true}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiStat
                title={
                  isNumber(props.counts.applicationSessions)
                    ? props.counts.applicationSessions
                    : 'NA'
                }
                titleSize="s"
                description="Application Sessions"
                textAlign="center"
                reverse={true}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <Chart id="session-resource-trend-chart" size={{ height: 300 }}>
                <Settings
                  showLegend
                  legendPosition="bottom"
                  showLegendDisplayValue={false}
                  // theme={[CUSTOMIZED_THEME.theme]}
                />
                <Axis
                  id={getAxisId('resource-axis-bottom')}
                  position="bottom"
                  showOverlappingTicks
                  tickFormat={timeFormatter(niceTimeFormatByDay(7))}
                />
                <Axis
                  id={getAxisId('session-axis-right')}
                  position="right"
                  domain={{ min: 0, max: 10 }}
                  showGridLines
                />
                <Axis
                  id={getAxisId('session-axis-left')}
                  position="left"
                  groupId={getGroupId('cpu')}
                  showGridLines
                />
                <LineSeries
                  id={getSpecId(resourceType)}
                  xScaleType="time"
                  yScaleType="linear"
                  xAccessor="time"
                  yAccessors={['cpu']}
                  groupId={getGroupId('cpu')}
                  stackAccessors={['cpu']}
                  splitSeriesAccessors={['g']}
                  data={props.trendData.resourceTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Sessions')}
                  xScaleType="time"
                  yScaleType="linear"
                  xAccessor="time"
                  yAccessors={['total']}
                  data={props.trendData.totalTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Desktop Sessions')}
                  xScaleType="time"
                  yScaleType="linear"
                  xAccessor="time"
                  yAccessors={['desktop']}
                  data={props.trendData.desktopTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Application Sessions')}
                  xScaleType="time"
                  yScaleType="linear"
                  xAccessor="time"
                  yAccessors={['application']}
                  data={props.trendData.applicationTrend || []}
                />
              </Chart>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={1}>{renderSummaryChart()}</EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default DashboardSessionResouceConsumption;
