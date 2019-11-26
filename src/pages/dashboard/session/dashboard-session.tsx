import { FC, useState, useEffect } from 'react';
import React from 'react';
import {
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFormRow,
  EuiSelect,
  EuiSpacer,
  EuiButton,
  EuiPopover,
  EuiForm,
  EuiTextArea
} from '@elastic/eui';
import { clone } from 'lodash';
import html2canvas from 'html2canvas';
import FileSaver, { saveAs } from 'file-saver';
import DashboardSessionSummary from './session-summary';
import DashboardSessionResouceConsumption from './session-resource-consumption';
import DashboardSessionConsumptionBars from './session-consumption-bars';
import DashboardSessionService from './session-service';
import { POOL_POD_MAP, ONE_HOUR_IN_MS } from './DASHBOARD-SESSION.CONSTANTS';
import EditThresholdsModal from './edit-thresholds-modal';
import EnvService from '../../../services/env_service';

type DashboardSessionPropsType = {
  isEmbed?: boolean;
};

const DashboardSession: FC<DashboardSessionPropsType> = (
  props: DashboardSessionPropsType
) => {
  const timeOptions = [
    {
      value: ONE_HOUR_IN_MS,
      text: 'Last 1 hours'
    },
    {
      value: 8 * ONE_HOUR_IN_MS,
      text: 'Last 8 hours'
    },
    {
      value: 12 * ONE_HOUR_IN_MS,
      text: 'Last 12 hours'
    },
    {
      value: 24 * ONE_HOUR_IN_MS,
      text: 'Last 24 hours'
    },
    {
      value: 48 * ONE_HOUR_IN_MS,
      text: 'Last 48 hours'
    },
    {
      value: 5 * 24 * ONE_HOUR_IN_MS,
      text: 'Last 5 days'
    },
    {
      value: 7 * 24 * ONE_HOUR_IN_MS,
      text: 'Last 7 days'
    }
  ];

  const locationOptions = [
    {
      value: 'all',
      text: 'All locations'
    },
    {
      value: '5d7c93ab-f430-4fd9-8cc5-af3c1b10d77b',
      text: 'Beijing, China'
    },
    {
      value: '02eb78fb-5f98-479e-b0dd-49628c4413eb',
      text: 'Palo Alto, CA, United States'
    }
  ];

  const podOptions = [
    {
      value: 'all',
      text: 'All Pods'
    },
    {
      value: '5bb367cd-4419-4c19-b139-865c7a02318f',
      text: 'AzureQ3'
    },
    {
      value: '74f86498-5f3b-40eb-b9ce-823ebcd4c8f0',
      text: 'pod-brown-2'
    }
  ];

  const poolOptionsRaw = [
    {
      value: 'all',
      text: 'All Pools'
    },
    ...POOL_POD_MAP.map(item => {
      return {
        value: item.poolid,
        text: item.pool,
        podid: item.smartnodeid
      };
    })
  ];

  const [timeInterval, setTimeInterval] = useState(timeOptions[0].value);
  const [location, setLocation] = useState();
  const [pod, setPod] = useState<string>('all');
  const [pool, setPool] = useState<string>('all');
  const [poolOptions, setPoolOptions] = useState<any[]>(poolOptionsRaw);
  const [counts, setCounts] = useState({});
  const [resourceTrendData, setResourceTrendData] = useState<any>({});
  const [resourcePodData, setResourcePodData] = useState<any>([]);
  const [resroucePodPieData, setResourcePodPieData] = useState<any>([]);
  const [latencyData, setLatencyData] = useState<any[]>([]);
  const [latencyRanges, setLatencyRanges] = useState<any>();
  const [isThresholdModalVisible, setIsThresholdModalVisible] = useState<
    boolean
  >(false);
  const [isIframePopoverOpen, setIsIframPopoverOpen] = useState<boolean>(false);

  const onTimeSelect = (e: any) => {
    setTimeInterval(e.target.value);
  };

  const onLocationSelect = (e: any) => {
    setLocation(e.target.value);
  };

  const onPodSelect = (e: any) => {
    if (e.target.value !== 'all') {
      setPoolOptions(
        poolOptionsRaw.filter((item: any) => {
          return item.value === 'all' || item.podid === e.target.value;
        })
      );
    } else {
      setPoolOptions(poolOptionsRaw);
    }
    setPod(e.target.value);
  };

  const onPoolSelect = (e: any) => {
    setPool(e.target.value);
  };

  const fetchConsumptionData = (resourceType: any, deployment: any) => {
    DashboardSessionService.getResourceConsumptionTrend(
      timeInterval,
      resourceType,
      pod,
      pool
    ).then((res: any) => {
      setResourceTrendData(res);
    });

    if (!deployment || deployment === 'Azure') {
      DashboardSessionService.getSessionPerPod(pod, pool).then((res: any) => {
        setResourcePodData(res);
      });
    } else {
      DashboardSessionService.getResourcePerPod(resourceType).then(
        (res: any) => {
          setResourcePodPieData(res);
        }
      );
    }
  };

  useEffect(() => {
    // TODO: get all user count summary info
    DashboardSessionService.getSessionOverview(pod, pool).then((res: any) => {
      setCounts({
        ...counts,
        ...res
      });
    });

    fetchConsumptionData(undefined, undefined);

    DashboardSessionService.getSessionLatency(pod, pool).then((res: any) => {
      setLatencyData(res);
    });

    DashboardSessionService.getLatencyBlastThresholds().then((res: any) => {
      setLatencyRanges(res);
    });

    return () => {
      setCounts({});
      setResourceTrendData({});
      setResourcePodData([]);
      setResourcePodPieData([]);
      setLatencyData([]);
    };
  }, [timeInterval, location, pod]);

  const onUpdateModalVisibility = (visible: boolean) => {
    setIsThresholdModalVisible(visible);

    if (!visible) {
      DashboardSessionService.getSessionLatency(pod, pool).then((res: any) => {
        setLatencyData(res);
      });

      DashboardSessionService.getLatencyBlastThresholds().then((res: any) => {
        setLatencyRanges(res);
      });
    }
  };

  const renderModal = () => {
    if (isThresholdModalVisible) {
      return (
        <EditThresholdsModal
          key="dashboard-session-threshold-modal"
          onClose={(() => onUpdateModalVisibility(false)).bind(
            DashboardSession
          )}
        />
      );
    }
  };

  const onSaveAsImage = () => {
    html2canvas(
      document.getElementById('dashboard-page-content') || document.body,
      {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      }
    ).then((canvas: any) => {
      FileSaver.saveAs(canvas.toDataURL(), 'dashboard-screenshot.png');
    });
  };

  const onIframeBtnClick = () => {
    setIsIframPopoverOpen(!isIframePopoverOpen);
  };

  const closeIframePopover = () => {
    setIsIframPopoverOpen(false);
  };

  const renderIframePopover = () => {
    const button = <EuiButton onClick={onIframeBtnClick}>Share</EuiButton>;

    return (
      <EuiPopover
        ownFocus
        button={button}
        isOpen={isIframePopoverOpen}
        closePopover={closeIframePopover}
      >
        <EuiForm>
          <EuiFormRow label="iframe code">
            <EuiTextArea
              value={`<iframe src="${window.location.href}?embed=true&token=${EnvService.token}" height="600" width="100%" frameborder="no"></iframe>`}
              readOnly
            />
          </EuiFormRow>
        </EuiForm>
      </EuiPopover>
    );
  };

  return (
    <>
      <EuiPageBody id="dashboard-page-content">
        {props.isEmbed ? (
          <></>
        ) : (
          <EuiPageHeader>
            <EuiPageHeaderSection className="mui-header">
              <EuiTitle size="l">
                <h1>Dashboard Sessions</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
        )}
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFormRow>
              <EuiSelect
                options={timeOptions}
                value={timeInterval}
                onChange={onTimeSelect}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow>
              <EuiSelect
                options={locationOptions}
                value={location}
                onChange={onLocationSelect}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow>
              <EuiSelect
                options={podOptions}
                value={pod}
                onChange={onPodSelect}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow>
              <EuiSelect
                options={poolOptions}
                value={pool}
                onChange={onPoolSelect}
              />
            </EuiFormRow>
          </EuiFlexItem>
          {props.isEmbed ? (
            <></>
          ) : (
            <>
              <EuiFlexItem grow={false}>
                <EuiButton onClick={onSaveAsImage}>Save as Image</EuiButton>
              </EuiFlexItem>
              <EuiFlexItem grow={false}>{renderIframePopover()}</EuiFlexItem>
            </>
          )}
        </EuiFlexGroup>
        <EuiSpacer size="m" />
        <DashboardSessionSummary counts={counts} />
        <EuiSpacer />
        <DashboardSessionResouceConsumption
          counts={counts}
          trendData={resourceTrendData}
          barData={resourcePodData}
          pieData={resroucePodPieData}
          fetchData={fetchConsumptionData}
        />
        <EuiSpacer />
        <DashboardSessionConsumptionBars
          blastData={latencyData}
          latencyRanges={latencyRanges}
          setModalVisible={onUpdateModalVisibility}
        />
      </EuiPageBody>
      {renderModal()}
    </>
  );
};

export default DashboardSession;
