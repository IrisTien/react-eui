import React, { FC } from 'react';

import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiStat } from '@elastic/eui';

type SummaryPropsType = {
  counts: {
    sessions?: number;
    users?: number;
    activeSessions?: number;
    disconnectedSessions?: number;
  };
};

const DashboardSessionSummary: FC<SummaryPropsType> = props => {
  return (
    <EuiPanel paddingSize='l' hasShadow>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiStat
            title={props.counts.sessions}
            description='Total Sessions'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={props.counts.users}
            description='Unique Users'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={props.counts.activeSessions}
            description='Active Sessions'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={props.counts.disconnectedSessions}
            description='Disconnected Sessions'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
};

export default DashboardSessionSummary;
