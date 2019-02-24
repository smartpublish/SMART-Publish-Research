import { Injectable } from '@angular/core'
import { ethers, utils } from 'ethers'
import { AlertService } from './alert.service'
import { Arrayish, Signature, arrayify, hashMessage } from 'ethers/utils';
import { JsonRpcProvider } from 'ethers/providers';

declare let window: any

@Injectable({
  providedIn: 'root'
})
export class EthereumService {

  readonly ethersProvider: JsonRpcProvider

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

  getProvider(): JsonRpcProvider {
    return this.ethersProvider
  }

  async getSCAddress(JSON_ABI): Promise<string> {
    const network = await this.ethersProvider.getNetwork()
    if (network.chainId) {
      return JSON_ABI.networks[network.chainId].address
    }
    throw new Error('Blockchain network could not be detected')
  }

  getPublicKey(message: Arrayish | string, signature: Signature | string): string {
    let key = utils.recoverPublicKey(utils.arrayify(utils.hashMessage(message)), signature)
    console.log("Uncompressed Public Key: " + key)
    let computedKey = '0x' + utils.computePublicKey(key).slice(4)
    console.log("Compressed Public Key : " + computedKey)
    console.log("Account (Uncompressed PubKey): " + utils.getAddress('0x' + utils.keccak256(key).substring(26)))
    console.log("Account (Compressed PubKey): " + utils.getAddress('0x' + utils.keccak256(computedKey).substring(26)))
    console.log("Verify message: " + utils.verifyMessage(message, signature))
    return computedKey
  }
}
