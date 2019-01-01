import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { ethers } from 'ethers';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  readonly web3Provider: null;
  readonly ethersProvider;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    window.web3 = new Web3(this.web3Provider);
    this.ethersProvider = new ethers.providers.Web3Provider(this.web3Provider);
  }

  getProvider() {
    return this.ethersProvider;
  }

  getWeb3() {
    return window.web3;
  }

  getAccountInfo() {
    return new Promise((resolve, reject) => {
      window.web3.eth.getCoinbase(function(err, account) {

        if(err === null) {
          window.web3.eth.getBalance(account, function(err, balance) {
            if(err === null) {
              return resolve({fromAccount: account, balance:(window.web3.utils.fromWei(balance, "ether"))});
            } else {
              return reject({fromAccount: "error", balance:0});
            }
          });
        }
      });
    });
  }

}
