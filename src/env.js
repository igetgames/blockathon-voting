export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  web3FallbackUrl: process.env.REACT_APP_WEB3_FALLBACK_URL || ''
};
