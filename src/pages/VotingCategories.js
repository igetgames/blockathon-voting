import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import Page from '../components/Page';

class VotingCategories extends Component {
  render() {
    return (
      <Page title="Categories">
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  Voting: state.contracts.Voting
});

export default drizzleConnect(VotingCategories, mapStateToProps);
