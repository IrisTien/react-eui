import { Component } from "react";
import React from "react";
import {
  EuiPageBody,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContent,
  EuiPanel,
  EuiFlexItem
} from '@elastic/eui';
import { DemoBarChart } from "./demo-bar-chart";
import UserService from '../../services/user_service';

export class Dashboard extends Component {
  render() {
    return (
      <EuiPageBody>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle size="l">
              <h1>Dashboard</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiFlexItem key={'panelItems'}>
            {/* <EuiPanel onClick={() => window.alert('Panel clicked')}>
              <p>Hover me to see my hover state.</p>
            </EuiPanel> */}
            <DemoBarChart />
          </EuiFlexItem>
        </EuiPageContent>
      </EuiPageBody>
    );
  }
}