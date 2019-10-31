import { FC } from 'react';
import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import DashboardSessionBlastLatency from './session-blast-latency';

type SessionConsumptionPropsTypes = {
  blastData?: any[];
};

const DashboardSessionConsumptionBars: FC<
  SessionConsumptionPropsTypes
> = props => {
  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        <DashboardSessionBlastLatency data={props.blastData} />
      </EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default DashboardSessionConsumptionBars;
