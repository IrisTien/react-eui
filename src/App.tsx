import React, { FC, useState, useEffect, Component } from 'react';
import './App.scss';
import Dashboard from './pages/dashboard/dashboard';
import {
  EuiPage,
  EuiPageBody,
  EuiTitle,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer
} from '@elastic/eui';
import { Switch, Route, useLocation } from 'react-router-dom';
import { Dashboards } from './pages/dashboard/dashboards';
import { AppNav } from './pages/nav/nav';
import DashboardSession from './pages/dashboard/session/dashboard-session';
import { tsConstructorType } from '@babel/types';
import ReactDOM, { render } from 'react-dom';
import AppRouterService from './app_router';
import DashboardBoard from './pages/board/board';
import queryString from 'query-string';
import EnvService from './services/env_service';
import NewBoard from './pages/board/newboard';
import EuiZoidComponent from './pages/component/eui-zoid';

type AppPropsType = {
  location?: any;
};

// class App extends Component<any, any> {
//   state = {
//     isEmbed: false
//   };
//   constructor(props: any) {
//     super(props);
//   }

//   componentDidMount() {
//     const history: any = AppRouterService.getHistory();
//     const paramArr = history.location.search.split('?embed=');
//     console.log(paramArr[1]);
//     this.state.isEmbed = Boolean(paramArr[1]);
//     // this.isEmbed = params.get('embed');
//     // console.log(this.isEmbed);
//   }

//   render() {
//     return (
//       <>
//         (this.state.isEmbed ? <></> : <AppNav />)
//         <EuiPage className='App-body'>
//           <Switch>
//             <Route exact path='/'>
//               <h1>Home Page</h1>
//             </Route>
//             <Route path='/session/:embed?'>
//               <DashboardSession />
//             </Route>
//             <Route path='/layout/dashboards'>
//               <Dashboards />
//             </Route>
//             <Route path='/layout/dashboard/:id'>
//               <Dashboard />
//             </Route>
//             <Route path='/layout/nav-drawer'>
//               <h1>Nav Drawer</h1>
//             </Route>
//           </Switch>
//         </EuiPage>
//       </>
//     );
//   }
// }

// export default App;

let ZoidReactWidget = EuiZoidComponent.driver('react', {
  React: React,
  ReactDOM: ReactDOM
});

const App: FC = (props: any) => {
  const [isEmbed, setIsEmbed] = useState<boolean>(false);
  const fieldName: any = 'xprops';

  useEffect(() => {
    const history: any = AppRouterService.getHistory();
    const params = queryString.parse(history.location.search);
    const currentPath = history.location.pathname;

    // if (params.token) {
    //   EnvService.token = params.token;
    //   if (history.location.pathname === '/noauth') {
    //     AppRouterService.navigateToApp({ path: 'app' });
    //   }
    // } else {
    //   AppRouterService.navigateToApp({ path: 'noauth' });
    // }
    setIsEmbed(params.embed === 'true');

    // window.addEventListener(
    //   'message',
    //   event => {
    //     console.log('receiveMessageFromTheZeddUI', event);
    //     if (event.data) {
    //       console.log(event.data);
    //       EnvService.token = event.data;

    //       window.parent.postMessage('The authentication succeed', '*');
    //     } else {
    //       // AppRouterService.navigateToApp({ path: 'noauth' });
    //     }
    //   },
    //   false
    // );

    //@ts-ignore
    const hydraToken = (window.xprops || {}).hydraToken;
    console.log(hydraToken);
    EnvService.token = hydraToken;
  }, []);

  const renderAppNav = () => {
    if (isEmbed) {
      return <></>;
    }
    return <AppNav />;
  };

  return (
    <>
      <Route path="/noauth">
        <ZoidReactWidget />
        <EuiPage {...window[fieldName]}>
          <EuiPageBody>
            <EuiSpacer size="xxl" />
            <EuiFlexGroup justifyContent="center">
              <EuiFlexItem grow={false}>
                <EuiIcon size="xxl" type="logoSecurity" />
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="xl" />
            <EuiTitle>
              <h1>Not Authenticated.</h1>
            </EuiTitle>
            <EuiTitle size="s">
              <h2>
                Please login Astro UI and click Monitoring icon, it will
                redirect you here to use Monitoring UI.
              </h2>
            </EuiTitle>
          </EuiPageBody>
        </EuiPage>
      </Route>
      <Route path="/app">
        {renderAppNav()}
        <EuiPage className={isEmbed ? 'App-body-embed' : 'App-body'}>
          <Switch>
            <Route exact path="/app">
              <h1>Home Page</h1>
            </Route>
            <Route path="/app/session/:embed?">
              <DashboardSession isEmbed={isEmbed} />
            </Route>
            <Route path="/app/board">
              <DashboardBoard />
            </Route>
            <Route path="/app/newBoard">
              <NewBoard />
            </Route>
            <Route path="/app/layout/dashboards">
              <Dashboards />
            </Route>
            <Route path="/app/layout/dashboard/:id">
              <Dashboard />
            </Route>
            <Route path="/app/layout/nav-drawer">
              <h1>Nav Drawer</h1>
            </Route>
          </Switch>
        </EuiPage>
      </Route>
    </>
  );
};

export default App;
