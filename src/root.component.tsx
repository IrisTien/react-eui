import React, { FC, useState } from 'react';
import './App.scss';
import Dashboard from './pages/dashboard/dashboard';
import { EuiPage } from '@elastic/eui';
import { Router, withRouter, Route, useLocation } from 'react-router-dom';
import { Dashboards } from './pages/dashboard/dashboards';
import AppRouterService from './app_router';
import { AppNav } from './pages/nav/nav';
import DashboardSession from './pages/dashboard/session/dashboard-session';
import ReactDOM from 'react-dom';
import App from './App';

type AppContainerPropsType = {
  router?: any;
};

class Root extends React.Component {
  constructor(props: AppContainerPropsType) {
    super(props);
    this.state = {
      appDom: undefined
    };
  }

  render() {
    return (
      <Router history={AppRouterService.getHistory()}>
        <div className="App" ref={(dom: any) => this.setState({ appDom: dom })}>
          <App></App>
        </div>
      </Router>
    );
  }
}

export default Root;
