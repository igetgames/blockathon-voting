import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import sitemap from './sitemap';
import './App.css';

const createRoutes = (contents, path) => (
  contents.reduce((routes, content) => {
    routes.push(
      <Route
        path={(path || '') + '/' + (content.path || '')}
        component={content.component}
        key={routes.length}
      />
    );
    return routes;
  }, [])
);

const Routes = ({ sitemap }) => (
  <Switch>
    {createRoutes(sitemap)}
  </Switch>
);

export default () => (
  <BrowserRouter>
    <Routes sitemap={sitemap} />
  </BrowserRouter>
);
