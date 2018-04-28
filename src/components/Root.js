import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Anchor from 'grommet/components/Anchor';
import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Menu from 'grommet/components/Menu';
import Router, { Routes } from './Router';
import sitemap from '../sitemap';

const menuAnchors = sitemap.reduce((anchors, content) => {
  if (content.label) {
    anchors.push(
      <Anchor
        key={content.path || '/'}
        path={`/${content.path || ''}`}
      >
        {content.label}
      </Anchor>
    );
  }
  return anchors;
}, []);

const RootSection = ({ children, ...props }) => (
  <Section
    justify='center'
    align='center'
    pad={{vertical: 'large'}}
    {...props}
  >
    {children}
  </Section>
);

export default () => (
  <BrowserRouter>
    <App>
      <Article>
        <Header fixed={false} appCentered={true}>
          <Menu direction="row">
            {menuAnchors}
          </Menu>
        </Header>
        <RootSection>
          <Router routes={<Routes sitemap={sitemap} />} />
        </RootSection>
      </Article>
    </App>
  </BrowserRouter>
);
