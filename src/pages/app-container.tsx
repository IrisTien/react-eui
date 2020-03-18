import React, { FC, useState } from 'react';
import './App.scss';
import Dashboard from './dashboard/dashboard';
import { EuiPage } from '@elastic/eui';
import { Router, withRouter, Route, useLocation } from 'react-router-dom';
import { Dashboards } from './dashboard/dashboards';
import AppRouterService from './app_router';
import { AppNav } from './nav/nav';
import DashboardSession from './dashboard/session/dashboard-session';
import ReactDOM from 'react-dom';
import App from './App';

type AppContainerPropsType = {
  router?: any;
};

const AppContainer: FC = (props: any) => {
  const [appDom, setAppDom] = useState<HTMLDivElement>();

  const appDomNode: any = ReactDOM.findDOMNode(appDom);
  if (appDomNode) {
    appDomNode.setAttribute('data-theme', 'dark');
  }

  return (
    <Router history={AppRouterService.getHistory()}>
      <div className="App" ref={(dom: any) => setAppDom(dom)}>
        <App></App>
      </div>
    </Router>
  );
};

export default AppContainer;
