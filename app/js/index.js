import React from 'react';
import ReactDom from 'react-dom';
import routes from './routes';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from '../../node_modules/react-router/node_modules/history';
// useRouterHistory creates a composable higher-order function
import '../css/plots.css';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

const App = () => (
  <Router history={appHistory} routes={routes} />
);

ReactDom.render(<App />, document.getElementById('react-app'));
