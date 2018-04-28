import Voting from './contracts/Voting.json';

export default {
  drizzleOptions: {
    contracts: [
      Voting
    ],
    web3: {
      fallback: {
        type: 'ws',
        url: 'wss://mainnet.infura.io/ws'
      }
    }
  }
};
