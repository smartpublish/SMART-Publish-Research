import { Injectable } from '@angular/core';
import { Paper } from '@app/modules/publication/models';
import { Observable } from 'rxjs';
import { EthereumService } from '@app/core/services';
import * as TruffleContract from "truffle-contract";
import { PublicationService } from '@app/modules/publication/services/publication.service';

declare let require: any;
let tokenAbiAssetFactory = require('@contracts/AssetFactory.json');

@Injectable({
  providedIn: 'root'
})
export class MyWorkService {

  readonly ASSET_FACTORY_SC = TruffleContract(tokenAbiAssetFactory);

  constructor(
    private ethereumService: EthereumService,
    private publicationService: PublicationService
  ) { 
    this.ASSET_FACTORY_SC.setProvider(ethereumService.web3Provider);
    // Init defaults
    this.ethereumService.getAccountInfo().then((acctInfo: any) => {
      this.ASSET_FACTORY_SC.defaults({
        from: acctInfo.fromAccount
      });
    });
  }

  getMyPapers(): Observable<Paper> {
    return Observable.create(observer => {
      this.ASSET_FACTORY_SC.deployed().then(async instance => {
        let acctInfo:any = await this.ethereumService.getAccountInfo()
        let assetsAddress:string[] = await instance.getAssetsByCreator.call(acctInfo.fromAccount)
        assetsAddress.forEach(async address => {
          let paper = await this.publicationService.getPaper(address)
          observer.next(paper)
        })
      });
    });
  }
}
