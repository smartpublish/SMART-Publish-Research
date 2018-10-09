import { Injectable } from '@angular/core';
import { EthereumService } from "@app/core/services/ethereum.service";
import { Paper } from "@app/modules/publication/models/paper.model";
import * as TruffleContract from "truffle-contract";
import { Observable } from "rxjs";

declare let require: any;

let tokenAbiPaperWF = require('@contracts/PaperWorkflow.json');
let tokenAbiPaper = require('@contracts/Paper.json');

// TODO refactor: copy contracts on webapp on production and use this path on development

@Injectable({
  providedIn: 'root'
})
export class PublicationService extends EthereumService {

  readonly PAPERWF_SC = TruffleContract(tokenAbiPaperWF);
  readonly PAPER_SC = TruffleContract(tokenAbiPaper);

  static ngInjectableDef = undefined;
  // TODO Workaoround inheritance on services, check: https://stackoverflow.com/questions/50263722/angular-6-services-and-class-inheritance

  constructor() {
    super();
    this.PAPERWF_SC.setProvider(this.web3Provider);
    this.PAPER_SC.setProvider(this.web3Provider);

    // Init defaults
    this.getAccountInfo().then((acctInfo : any) => {
      this.PAPERWF_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.PAPER_SC.defaults({
        from: acctInfo.fromAccount
      })
    });
  }

  getAllPapers(state: string): Observable<any[]> {
    let that = this;
    let data: any = {};
    return Observable.create(observer => {
      this.PAPERWF_SC.deployed().then(instance => {
        return instance.findPapers.call(state);
      }).then(addresses => {
        console.log(addresses);
        addresses.forEach((address) => {
          console.log(address);
          this.PAPER_SC.at(address).then(instance => {
            return Promise.all([
              instance.title.call(),
              instance.summary.call(),
              instance.location.call()
            ]);
          }).then(values => {
            let paper:Paper = new Paper(values[0], values[1], values[2], address);
            observer.next(paper);
          }).catch(err => console.log(err));
        });
      });
    });
  }

  submit(paper: Paper) {
    return new Promise((resolve, reject) => {
      this.PAPERWF_SC.deployed().then(instance => {
        console.log(paper);
        return instance.submit('Internal location', paper.title, paper.abstract);
      }).then(function(status) {
        console.log(status);
        if(status) {
          return resolve({status:true});
        }
      }).catch(function(error){
        console.log(error);
        return reject("Error in transferEther service call");
      });
    });

  }

}
