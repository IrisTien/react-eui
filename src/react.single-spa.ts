// import React, { FC } from 'react';
// import ReactDOM from 'react-dom';
// import './index.scss';
// import * as serviceWorker from './serviceWorker';
// import AppContainer from './app-container';

// ReactDOM.render(<AppContainer />, document.getElementById('root'));
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import root from './root.component';
import * as serviceWorker from './serviceWorker';
import { property } from 'lodash';

const reactLifeCycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: root,
  // @ts-ignore
  domElementGetter: () =>
    document.getElementById('singe-spa-external-container')
});

export const bootstrap = [reactLifeCycles.bootstrap];
export const mount = [reactLifeCycles.mount];
export const unmount = [reactLifeCycles.unmount];

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
