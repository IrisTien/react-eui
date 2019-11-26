import { FC } from 'react';
import React from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import DashboardSessionBlastLatency from './session-blast-latency';

type SessionConsumptionPropsTypes = {
  blastData?: any[];
  latencyRanges?: any;
  setModalVisible: Function;
};

const DashboardSessionConsumptionBars: FC<
  SessionConsumptionPropsTypes
> = props => {
  return (
    <EuiFlexGroup>
      <EuiFlexItem>
        <DashboardSessionBlastLatency
          data={props.blastData}
          latencyRanges={props.latencyRanges}
          setModalVisible={props.setModalVisible}
        />
      </EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
      <EuiFlexItem></EuiFlexItem>
    </EuiFlexGroup>
  );
};

export default DashboardSessionConsumptionBars;
