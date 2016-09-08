import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './layout';
import Home from './home';
import PlotSet from './plotSet';
import QuestionView from './questionView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path=":categoryID" component={PlotSet} />
    <Route path="question/:questionNumber" component={QuestionView} />
  </Route>
);
