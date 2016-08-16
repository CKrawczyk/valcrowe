import React from 'react';
import ReactDom from 'react-dom';
import routes from './routes';
import { Router, hashHistory } from 'react-router';
import '../css/plots.css';

const App = () => (
  <Router history={hashHistory} routes={routes} />
);

ReactDom.render(<App />, document.getElementById('react-app'));
