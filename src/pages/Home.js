import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Page from '../components/Page';

class Home extends Component {
  render() {
    return (
      <Page title="Arizona Blockathon Voting Dapp"></Page>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  Voting: state.contracts.Voting
});

export default drizzleConnect(Home, mapStateToProps);
