import { FC } from 'react';
import React from 'react';
import { EuiPanel, EuiText } from '@elastic/eui';

const ResultPanel: FC<any> = (props: any) => {
  return (
    <EuiPanel paddingSize='l'>
      <EuiText>
        <h1>This is the selection of Board Form</h1>
        <p>{JSON.stringify(props.checkboxSelected)}</p>
      </EuiText>
    </EuiPanel>
  );
};

export default ResultPanel;
