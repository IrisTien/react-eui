import { FC } from 'react';
import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import DashboardSessionBlastLatency from './session-blast-latency';

const DashboardSessionConsumptionBars: FC = () => {
  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        <DashboardSessionBlastLatency />
      </EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default DashboardSessionConsumptionBars;
