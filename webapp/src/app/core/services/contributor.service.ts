import { Injectable } from '@angular/core';

import { IContributor } from '../models/contributor.model';
// import * as Web3 from 'web3';
// import * as TruffleContract from 'truffle-contract';
import {EthereumService} from "./ethereum.service";

declare let require: any;
declare let window: any;

// TODO Refactor path
let tokenAbiContributorFactory = require('../../../../../dapp/build/contracts/ContributorFactory.json');
let tokenAbiReasearcher = require('../../../../../dapp/build/contracts/Researcher.json');
let tokenAbiOrganization = require('../../../../../dapp/build/contracts/Organization.json');

@Injectable({
  providedIn: 'root',
})
export class ContributorService extends EthereumService {

  register(contributor: IContributor) {

    // return this.http.post(`${config.apiUrl}/users/register`, user);
  }

}
