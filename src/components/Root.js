import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import App from 'grommet/components/App';
import Router, { Routes } from './Router';
import sitemap from '../sitemap';

export default () => (
  <BrowserRouter>
    <App>
      <Router routes={<Routes sitemap={sitemap} />} />
    </App>
  </BrowserRouter>
);
