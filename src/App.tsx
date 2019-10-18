import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import { AppHeader } from './header/Header';
import { AppNav } from './nav/Nav';
import { registerRouter } from './app_router';
import PropTypes from 'prop-types';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
} from '@elastic/eui';
import {
  BrowserRouter as Router
} from 'react-router-dom';

class App extends Component {

  constructor(props: any) {
    super(props);

    registerRouter(window.location.pathname);
  }

  render() {
    return (
      <Router {...this.props}>
        <div className="App">
          <AppNav />
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
