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
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 8000000
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.METAMASK_MNEMONIC, process.env.INFURA_API_ROPSTEN_ENDPOINT)
      },
      network_id: 3,
      gas: 8000000
    },
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
