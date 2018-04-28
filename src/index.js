import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import 'grommet/grommet.min.css';
import './index.css';
import Root from './components/Root';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import config from './config';

ReactDOM.render(
  <DrizzleProvider options={config.drizzleOptions} store={store}>
    <LoadingContainer>
      <Root />
    </LoadingContainer>
  </DrizzleProvider>
  , document.getElementById('root'));
registerServiceWorker();
