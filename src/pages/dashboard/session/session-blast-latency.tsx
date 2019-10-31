import { FC, useState, MouseEvent } from 'react';
import React from 'react';
import {
  EuiPanel,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiIcon,
  EuiPopover,
  EuiFlexGroup,
  EuiFlexItem
} from '@elastic/eui';
import {
  Chart,
  Settings,
  BarSeries,
  Axis,
  getSpecId,
  getAxisId
} from '@elastic/charts';
import { PropertySortType } from '@elastic/eui';

type SessionBlastLatencyPropTypes = {
  data?: any[];
};

const DashboardSessionBlastLatency: FC<
  SessionBlastLatencyPropTypes
> = props => {
  const [isRefreshInfoOpen, setIsRefreshInfoOpen] = useState();

  let panel: any;
  const setPanelRef = (node: any) => {
    panel = node;
  };
  const onInfoIconClick = (event: MouseEvent) => {
    setIsRefreshInfoOpen(!isRefreshInfoOpen);
  };

  const closeRefreshInfo = () => {
    setIsRefreshInfoOpen(false);
  };

  const tickFormat = (value: any) => {
    switch (value) {
      case 0:
        return '>250 ms';
      case 1:
        return '200-250 ms';
      case 2:
        return '150-200 ms';
      case 3:
        return '100-150 ms';
      case 4:
        return '<100 ms';
      default:
        return '';
    }
  };

  const renderPopover = () => {
    const infoIcon = <EuiIcon type='iInCircle' onClick={onInfoIconClick} />;

    return (
      <EuiPopover
        ownFocus
        button={infoIcon}
        isOpen={isRefreshInfoOpen}
        closePopover={closeRefreshInfo}
        container={panel}
      >
        <div>Refreshed 1 min ago.</div>
      </EuiPopover>
    );
  };

  return (
    <EuiPanel panelRef={setPanelRef}>
      <EuiTitle size='xs' className='mui-header'>
        <h1>Latency (BLAST)</h1>
      </EuiTitle>
      <EuiSpacer size='s' />
      <EuiText textAlign='left'>
        <span className='session-text-label'>Realtime</span>
        {renderPopover()}
      </EuiText>
      <EuiFlexGroup>
        <EuiFlexItem>
          <Chart size={{ height: 300 }}>
            <Settings rotation={90} />
            <BarSeries
              id={getSpecId('sessions')}
              xScaleType='linear'
              yScaleType='linear'
              xAccessor='index'
              yAccessors={['session']}
              data={props.data}
            />
            <Axis
              id={getAxisId('session-blast-left-axis')}
              position='left'
              tickFormat={tickFormat}
            />
            <Axis
              id={getAxisId('session-blast-bottom-axis')}
              position='bottom'
            />
          </Chart>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default DashboardSessionBlastLatency;
