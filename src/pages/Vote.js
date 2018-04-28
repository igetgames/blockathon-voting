import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { ContractForm } from 'drizzle-react-components';
import Page from '../components/Page';

class Vote extends Component {
  render() {
    return (
      <Page title="Vote">
        {/* <ContractData contract="Voting" method="voteCategories" methodArgs={[0]} /> */}
        <ContractForm contract="Voting" method="vote" labels={['Category ID', 'Team ID', 'Value', 'Force Revote']} />
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  Voting: state.contracts.Voting
});

export default drizzleConnect(Vote, mapStateToProps);
