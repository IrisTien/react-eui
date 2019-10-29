import React, { FC } from 'react';

import { EuiPanel, EuiFlexGroup, EuiFlexItem, EuiStat } from '@elastic/eui';

import { isNumber } from 'lodash';

type SummaryPropsType = {
  counts: {
    sessions?: number | string;
    users?: number | string;
    activeSessions?: number | string;
    disconnectedSessions?: number | string;
  };
};

const DashboardSessionSummary: FC<SummaryPropsType> = props => {
  return (
    <EuiPanel paddingSize='l' hasShadow>
      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiStat
            title={
              isNumber(props.counts.sessions) ? props.counts.sessions : 'NA'
            }
            description='Total Sessions'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={isNumber(props.counts.users) ? props.counts.users : 'NA'}
            description='Unique Users'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={
              isNumber(props.counts.activeSessions)
                ? props.counts.activeSessions
                : 'NA'
            }
            description='Active Sessions'
            reverse={true}
            textAlign='center'
          />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiStat
            title={
              isNumber(props.counts.disconnectedSessions)
                ? props.counts.disconnectedSessions
                : 'NA'
            }
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
