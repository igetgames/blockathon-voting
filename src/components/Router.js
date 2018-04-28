import React from 'react';
import { Route, Switch } from 'react-router-dom';

const createRoutes = (contents, path) => (
  contents.reduce((routes, content) => {
    routes.push(
      <Route
        path={(path || '') + '/' + (content.path || '')}
        component={content.component}
        exact={content.exact || true}
        key={routes.length}
      />
    );
    return routes;
  }, [])
);

export const Routes = ({ sitemap }) => (
  <Switch>
    {createRoutes(sitemap)}
  </Switch>
);

export default ({ routes }) => routes;
