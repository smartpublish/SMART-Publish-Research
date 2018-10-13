import { Injectable } from '@angular/core';
import * as Web3 from 'web3';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  readonly web3Provider: null;

  constructor() {
    if (typeof window.web3 !== 'undefined') {
      this.web3Provider = window.web3.currentProvider;
    } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    window.web3 = new Web3(this.web3Provider);
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
