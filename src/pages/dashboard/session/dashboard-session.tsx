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
  EuiPanel
} from '@elastic/eui';
import DashboardSessionSummary from './session-summary';
import DashboardSessionResouceConsumption from './session-resource-consumption';
import DashboardSessionConsumptionBars from './session-consumption-bars';
import DashboardSessionService from './session-service';

const DashboardSession: FC = (props: any) => {
  const timeOptions = [
    {
      value: '8h',
      text: 'Last 8 hours'
    },
    {
      value: '12h',
      text: 'Last 12 hours'
    },
    {
      value: '24h',
      text: 'Last 24 hours'
    },
    {
      value: '48h',
      text: 'Last 48 hours'
    },
    {
      value: '5d',
      text: 'Last 5 days'
    },
    {
      value: '7d',
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

  const [timeInterval, setTimeInterval] = useState(timeOptions[2].value);
  const [location, setLocation] = useState();
  const [pod, setPod] = useState<string>('');
  const [counts, setCounts] = useState({});

  const onTimeSelect = (e: any) => {
    setTimeInterval(e.target.value);
  };

  const onLocationSelect = (e: any) => {
    setLocation(e.target.value);
  };

  const onPodSelect = (e: any) => {
    setPod(e.target.value);
  };

  useEffect(() => {
    // TODO: get all user count summary info
    DashboardSessionService.getSessionOverview(pod).then((res: any) => {
      setCounts({
        ...counts,
        ...res
      });
    });
    setCounts({
      desktopSessions: 1,
      applicationSessions: 1
    });
    return () => {
      setCounts({});
    };
  }, [timeInterval, location, pod]);

  return (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiPageHeaderSection className='mui-header'>
          <EuiTitle size='l'>
            <h1>Dashboard Sessions</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
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
      </EuiFlexGroup>
      <EuiSpacer size='m' />
      <DashboardSessionSummary counts={counts} />
      <EuiSpacer />
      <DashboardSessionResouceConsumption counts={counts} />
      <EuiSpacer />
      <DashboardSessionConsumptionBars />
    </EuiPageBody>
  );
};

export default DashboardSession;
