import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { ContractForm } from 'drizzle-react-components';
import Page from '../components/Page';

class Teams extends Component {
  render() {
    return (
      <Page title="Teams">
      </Page>
    );
  }
}
const mapStateToProps = state => ({
  Voting: state.contracts.Voting
});

export default drizzleConnect(Teams, mapStateToProps);
