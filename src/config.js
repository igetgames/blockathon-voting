import Voting from './contracts/Voting.json';
import env from './env';

const web3FallbackUrl = env.web3FallbackUrl
  || env.isProduction
  ? 'wss://mainnet.infura.io/ws'
  : 'ws://127.0.0.1:8545';

export default {
  drizzleOptions: {
    contracts: [
      Voting
    ],
    web3: {
      fallback: {
        type: 'ws',
        url:  web3FallbackUrl
      }
    }
  }
};
