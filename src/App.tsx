import React, { FC } from 'react';
import './App.scss';
import Dashboard from './pages/dashboard/dashboard';
import { EuiPage } from '@elastic/eui';
import { Router, Switch, Route } from 'react-router-dom';
import { Dashboards } from './pages/dashboard/dashboards';
import AppRouterService from './app_router';
import { AppNav } from './pages/nav/nav';
import DashboardSession from './pages/dashboard/session/dashboard-session';

type AppPropsType = {
  router?: any;
};

const App: FC = (props: any) => {
  return (
    <Router history={AppRouterService.getHistory()}>
      <div className='App'>
        <AppNav />
        <EuiPage className='App-body'>
          <Switch>
            <Route exact path='/'>
              <h1>Home Page</h1>
            </Route>
            <Route path='/session'>
              <DashboardSession />
            </Route>
            <Route path='/layout/dashboards'>
              <Dashboards />
            </Route>
            <Route path='/layout/dashboard/:id'>
              <Dashboard />
            </Route>
            <Route path='/layout/nav-drawer'>
              <h1>Nav Drawer</h1>
            </Route>
          </Switch>
          {/* {content} */}
        </EuiPage>

        {/* <EuiPageSideBar>SideBar nav</EuiPageSideBar>
        <EuiPageBody>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Page Title</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
            <EuiPageHeaderSection>Page abilities</EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Content title</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
              <EuiPageContentHeaderSection>
                Content abilities
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>Content body</EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody> */}
      </div>
    </Router>
  );
};

export default App;
