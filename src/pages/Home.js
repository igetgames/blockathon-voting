import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';

class Home extends Component {
  render() {
    return (
      <main>

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
