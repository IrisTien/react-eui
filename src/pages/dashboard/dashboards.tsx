import { Component, Fragment } from 'react';
import React from 'react';
import {
  EuiPageBody,
  EuiPanel,
  // @ts-ignore
  EuiSearchBar,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  // @ts-ignore
  EuiBasicTable
} from '@elastic/eui';
import { CreateDashboardForm } from './create-dashboard-form';
import DashboardService from '../../services/dashboard_service';
import EuiCustomLink from '../component/eui-custom-link';

export class Dashboards extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.closeDashboardCreateModal = this.closeDashboardCreateModal.bind(this);
    this.showDashboardCreateModal = this.showDashboardCreateModal.bind(this);
  }
  state = {
    isModalVisible: false,
    data: []
  };

  columns: any = [
    {
      field: 'name',
      name: 'Dashboard Title',
      sortable: true,
      render: (name: any, item: any) => (
        <EuiCustomLink to={`/app/layout/dashboard/${item.id}`}>
          {name}
        </EuiCustomLink>
      )
    },
    {
      field: 'desp',
      name: 'Description',
      sortable: true
    }
  ];

  componentDidMount() {
    this.getDashboardsData();
  }

  getRowProps(item: any) {
    const { id } = item;
    return {
      onClick: () => console.log(`Clicked row ${id}`)
    };
  }

  getCellProps(item: any, column: any) {
    const { id } = item;
    const { field } = column;
    return {
      textOnly: true
    };
  }

  onSearch({ query, error }: any) {
    console.log('search dashboard');
    console.log(query);
    console.log(error);
  }

  closeDashboardCreateModal() {
    this.getDashboardsData();
    this.setState({
      isModalVisible: false
    });
  }

  showDashboardCreateModal() {
    this.setState({
      isModalVisible: true
    });
  }

  render() {
    const dashboards = (
      <EuiPageBody>
        <EuiPanel onClick={() => console.log('Dashboards Panel clicked')}>
          <EuiFlexGroup gutterSize="s" alignItems="center">
            <EuiFlexItem>
              <EuiTitle size="l">
                <h1>Dashboard</h1>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton fill onClick={this.showDashboardCreateModal}>
                Create New Dashboard
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiSearchBar onChange={this.onSearch} />
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup>
            <EuiFlexItem>
              <EuiBasicTable
                items={this.state.data}
                columns={this.columns}
                rowProps={this.getRowProps}
                cellProps={this.getCellProps}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPanel>
      </EuiPageBody>
    );

    let modal;

    if (this.state.isModalVisible) {
      modal = (
        <CreateDashboardForm
          onClose={this.closeDashboardCreateModal}
        ></CreateDashboardForm>
      );
    }
    return (
      <Fragment>
        {dashboards}
        {modal}
      </Fragment>
    );
  }

  private getDashboardsData() {
    DashboardService.getDashboards().then((data: any) => {
      this.setState({
        data: data
      });
    });
  }
}
