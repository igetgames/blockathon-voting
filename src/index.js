import React from 'react';
import ReactDOM from 'react-dom';
import { DrizzleProvider } from 'drizzle-react';
import { LoadingContainer } from 'drizzle-react-components';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import config from './config';

ReactDOM.render(
  <DrizzleProvider options={config.drizzleOptions} store={store}>
    <LoadingContainer>
      <App />
    </LoadingContainer>
  </DrizzleProvider>
  , document.getElementById('root'));
registerServiceWorker();
