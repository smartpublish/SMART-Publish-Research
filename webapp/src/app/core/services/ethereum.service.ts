import { Injectable } from '@angular/core'
import { ethers } from 'ethers'
import { AlertService } from './alert.service'

declare let window: any

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  readonly ethersProvider

  constructor(private alertService: AlertService) {
    // New MetaMask injects a Web3 Provider as "window.ethereum"
    if (window.ethereum) {
      this.ethersProvider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        window.ethereum.enable()
      } catch (error) {
        console.error(error)
        this.alertService.error('You must allow access Metamask in order to use this application')
      }
    } else if (window.web3) {
      this.ethersProvider = new ethers.providers.Web3Provider(window.web3.currentProvider)
    } else {
      this.ethersProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545')
    }
  }

  getProvider() {
    return this.ethersProvider
  }

  async getSCAddress(JSON_ABI): Promise<string> {
    const network = await this.ethersProvider.getNetwork()
    if (network.chainId) {
      return JSON_ABI.networks[network.chainId].address
    }
    throw new Error('Blockchain network could not be detected')
  }

}
