import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  readonly ethersProvider;

  constructor() {
    // MetaMask injects a Web3 Provider as "web3.currentProvider"
    if (typeof window.web3 !== 'undefined') {
      this.ethersProvider = new ethers.providers.Web3Provider(window.web3.currentProvider)
    } else {
      this.ethersProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    }
  }

  getProvider() {
    return this.ethersProvider;
  }

  async getSCAddress(JSON_ABI):Promise<string> {
    let network = await this.ethersProvider.getNetwork()
    if(network.chainId) {
      return JSON_ABI.networks[network.chainId].address;
    }
    throw new Error("Blockchain network could not be detected")
  }

  getWeb3() {
    return window.web3;
  }

}
