require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 8000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider([
          process.env.ACCOUNT_PRIVATE_KEY_0,
          process.env.ACCOUNT_PRIVATE_KEY_1,
          process.env.ACCOUNT_PRIVATE_KEY_2,
          process.env.ACCOUNT_PRIVATE_KEY_3,
          process.env.ACCOUNT_PRIVATE_KEY_4,
          process.env.ACCOUNT_PRIVATE_KEY_5,
          process.env.ACCOUNT_PRIVATE_KEY_6,
          process.env.ACCOUNT_PRIVATE_KEY_7,
          process.env.ACCOUNT_PRIVATE_KEY_8,
          process.env.ACCOUNT_PRIVATE_KEY_9,
        ], process.env.INFURA_API_ROPSTEN_ENDPOINT, 0, 10)
      },
      network_id: 3,
      gas: 8000000
    }
  }
};
