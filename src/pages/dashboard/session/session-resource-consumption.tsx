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

type SessionResourcePropsType = {
  counts: {
    sessions?: number;
    desktopSessions?: number;
    applicationSessions?: number;
  };
  trendData: {
    cpuTrend?: any[];
    totalTrend?: any[];
    desktopTrend?: any[];
    applicationTrend?: any[];
    podData?: any[];
  };
  barData?: any[];
};

const DashboardSessionResouceConsumption: FC<
  SessionResourcePropsType
> = props => {
  const resourceOptions = [
    {
      value: 'CPU',
      text: 'CPU'
    },
    {
      value: 'Memory',
      text: 'Memory'
    },
    {
      value: 'Disk IOPS',
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

  const [resourceType, setResourceType] = useState(resourceOptions[0].value);
  const [deployment, setDeployment] = useState();

  return (
    <EuiPanel paddingSize='m' hasShadow>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size='xs' className='mui-header'>
            <h1>Resource Consumption</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow>
            <EuiSelect
              options={resourceOptions}
              value={resourceType}
              onChange={(e: any) => setResourceType(e.target.value)}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiFormRow>
            <EuiSelect
              options={deploymentOptions}
              value={deployment}
              onChange={(e: any) => setDeployment(e.target.value)}
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
                titleSize='s'
                description='Total Sessions'
                textAlign='center'
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
                titleSize='s'
                description='Desktop Sessions'
                textAlign='center'
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
                titleSize='s'
                description='Application Sessions'
                textAlign='center'
                reverse={true}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <Chart size={{ height: 300 }}>
                <Settings
                  showLegend
                  legendPosition='bottom'
                  showLegendDisplayValue={false}
                />
                <LineSeries
                  id={getSpecId('resource-consumption-line')}
                  xScaleType='time'
                  yScaleType='linear'
                  xAccessor='time'
                  yAccessors={['cpu']}
                  groupId={getGroupId('cpu')}
                  data={props.trendData.cpuTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Sessions')}
                  xScaleType='time'
                  yScaleType='linear'
                  xAccessor='time'
                  yAccessors={['total']}
                  data={props.trendData.totalTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Desktop Sessions')}
                  xScaleType='time'
                  yScaleType='linear'
                  xAccessor='time'
                  yAccessors={['desktop']}
                  data={props.trendData.desktopTrend || []}
                />
                <LineSeries
                  id={getSpecId('Total Application Sessions')}
                  xScaleType='time'
                  yScaleType='linear'
                  xAccessor='time'
                  yAccessors={['application']}
                  data={props.trendData.applicationTrend || []}
                />
                <Axis
                  id={getAxisId('session-axis-bottom')}
                  position='bottom'
                  tickFormat={timeFormatter(niceTimeFormatByDay(7))}
                />
                <Axis
                  id={getAxisId('session-axis-right')}
                  position='right'
                  showGridLines
                />
                <Axis
                  id={getAxisId('session-axis-left')}
                  position='left'
                  groupId={getGroupId('cpu')}
                  showGridLines
                />
              </Chart>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={1}>
          <Chart>
            <Settings rotation={90} />
            <BarSeries
              id={getSpecId('pod-session-series')}
              xScaleType='linear'
              yScaleType='linear'
              xAccessor='index'
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
              position='bottom'
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default DashboardSessionResouceConsumption;
