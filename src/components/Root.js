import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Router, { Routes } from './Router';
import sitemap from '../sitemap';

export default () => (
  <BrowserRouter>
    <Router routes={<Routes sitemap={sitemap} />} />
  </BrowserRouter>
);
