import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components';

class Home extends Component {
  render() {
    return (
      <main>
        <AccountData accountIndex="0" units="ether" precision="2" />
        <br />
        <p><strong>OG Chairperson: </strong><ContractData contract="Voting" method="ogChairperson" /></p>
        <br />
        <p><strong>Add Chairperson </strong><ContractForm contract="Voting" method="addChairperson" labels={['Chairperson']} /></p>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  Voting: state.contracts.Voting
});

export default drizzleConnect(Home, mapStateToProps);
