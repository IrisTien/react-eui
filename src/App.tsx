import React, { Component } from 'react';
import './App.scss';
import { AppNav } from './pages/nav/nav';
import { Dashboard } from './pages/dashboard/dashboard';
import {
  EuiPage
} from '@elastic/eui';
import {
  BrowserRouter as Router, Route, Switch, useHistory
} from 'react-router-dom';
import { Dashboards } from './pages/dashboard/dashboards';

type AppPropsType = {
  router?: any
};

class App extends Component<AppPropsType, {}> {
  state = {
    url: window.location.href
  }

  constructor(props: any) {
    super(props);

    window.onhashchange = () => {
      const urlArr = window.location && window.location.href.split('#');

      if (urlArr && urlArr.length > 1) {
        this.setState({
          url: window.location.href.split('#')[1]
        });
      }
    }
  }

  render() {
    let content;
    switch (this.state.url) {
      case '/layout/nav-drawer':
        content = <h1>Nav Drawer</h1>;
        break;
      case '/layout/dashboards':
        content = <Dashboards />;
        break;
      case '/layout/dashboard':
        content = <Dashboard />;
        break;
      default:
        content = <Dashboard />;
        break;
    }
    return (
      <Router>
        <div className="App">
          <AppNav />
          <EuiPage className="App-body">
            {/* <Switch>
              <Route path="#/layout/dashboards">
                <Dashboards />
              </Route>
              <Route path='#/layout/nav-drawer'>
                <Dashboard />
              </Route>
            </Switch> */}
            {content}
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
  }
}

export default App;
