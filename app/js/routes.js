import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './layout';
import Home from './home';
import PlotSet from './plotSet';
import UserPlotSet from './userPlotSet';
import QuestionView from './questionView';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="Users" component={UserPlotSet} />
    <Route path=":categoryID" component={PlotSet} />
    <Route path="question/:questionNumber" component={QuestionView} />
  </Route>
);
