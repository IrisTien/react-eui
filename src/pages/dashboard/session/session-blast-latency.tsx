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
  EuiFlexItem,
  EuiButtonEmpty
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
import { EuiContextMenu } from '@elastic/eui';
import { EuiContextMenuPanelDescriptor } from '@elastic/eui';
import html2canvas from 'html2canvas';

type SessionBlastLatencyPropTypes = {
  data?: any[];
  latencyRanges?: any;
  setModalVisible: Function;
};

const DashboardSessionBlastLatency: FC<
  SessionBlastLatencyPropTypes
> = props => {
  const [isRefreshInfoOpen, setIsRefreshInfoOpen] = useState();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);

  const contextPanel: any[] = [
    {
      id: 0,
      title: 'Option',
      items: [
        {
          name: 'Edit thresholds',
          icon: <EuiIcon type='search' size='m' />,
          onClick: () => onContextItemClick('editThreshold')
        },
        {
          name: 'Save as image',
          icon: <EuiIcon type='save' size='m' />,
          onClick: () => onContextItemClick('saveImage')
        }
      ]
    }
  ];

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

  const generateAxisLabel = (
    from: number | undefined,
    to: number | undefined
  ) => {
    if (!from) {
      return `<${to} ms`;
    } else if (!to) {
      return `>${from} ms`;
    }
    return `${from}-${to} ms`;
  };

  const tickFormat = (value: any) => {
    if (props.latencyRanges[value]) {
      return generateAxisLabel(
        props.latencyRanges[value].from,
        props.latencyRanges[value].to
      );
    }
    return '';
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

  const onContextBtnClick = (e: MouseEvent<HTMLButtonElement>) => {
    setIsContextMenuOpen(!isContextMenuOpen);
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  const onContextItemClick = (event: string) => {
    closeContextMenu();
    if (event === 'editThreshold') {
      props.setModalVisible(true);
    } else if (event === 'saveImage') {
      html2canvas(panel, {
        windowWidth: 600,
        windowHeight: 500
      }).then((canvas: any) => {
        saveAs(canvas.toDataURL(), 'session-blast-latency-chart.png');
      });
    }
  };

  const renderContextMenu = () => {
    const button = (
      <EuiButtonEmpty
        iconType='arrowDown'
        iconSide='right'
        onClick={onContextBtnClick}
      >
        ...
      </EuiButtonEmpty>
    );
    return (
      <EuiPopover
        id='context-menu-popover'
        button={button}
        isOpen={isContextMenuOpen}
        closePopover={closeContextMenu}
        anchorPosition='downLeft'
      >
        <EuiContextMenu initialPanelId={0} panels={contextPanel} />
      </EuiPopover>
    );
  };

  return (
    <EuiPanel panelRef={setPanelRef}>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiTitle size='xs' className='mui-header'>
            <h1>Latency (BLAST)</h1>
          </EuiTitle>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>{renderContextMenu()}</EuiFlexItem>
      </EuiFlexGroup>
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
