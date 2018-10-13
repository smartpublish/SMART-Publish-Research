import { Injectable } from '@angular/core';
import { EthereumService } from "@app/core/services/ethereum.service";
import { Paper } from "@app/modules/publication/models/paper.model";
import * as TruffleContract from "truffle-contract";
import { Observable } from "rxjs";
import { IpfsService } from "@app/core/services/ipfs.service";

declare let require: any;

let tokenAbiPaperWF = require('@contracts/PaperWorkflow.json');
let tokenAbiPaper = require('@contracts/Paper.json');

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  readonly PAPERWF_SC = TruffleContract(tokenAbiPaperWF);
  readonly PAPER_SC = TruffleContract(tokenAbiPaper);

  constructor(
    private ethereumService: EthereumService,
    private ipfsService: IpfsService) {

    this.PAPERWF_SC.setProvider(ethereumService.web3Provider);
    this.PAPER_SC.setProvider(ethereumService.web3Provider);

    // Init defaults
    this.ethereumService.getAccountInfo().then((acctInfo : any) => {
      this.PAPERWF_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.PAPER_SC.defaults({
        from: acctInfo.fromAccount
      })
    });
  }

  getAllPapers(state: string): Observable<any[]> {
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
    return this.submitToIpfs(paper).then((ipfsObject) => {
      if(ipfsObject) {
        paper.location = ipfsObject['link'];
        console.log(paper);
        return this.submitToEthereum(paper)
      }
    }).then((status) => {
      console.log(status)
    }).catch((error) => {
      console.error(error);
    });
  }

  private submitToIpfs(paper: Paper):Promise<any> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
        }, 10000);

        var reader = new FileReader();
        reader.onload = (e) => {
          this.ipfsService.upload(reader.result)
            .then((ipfsObject) => {
              try {
                resolve({
                  hash: ipfsObject,
                  link: 'https://ipfs.io/ipfs/' + ipfsObject
                });
              } catch(e) {
                console.error(e);
              }
            });
        };
        reader.readAsArrayBuffer(paper.file);
      })
  }

  private submitToEthereum(paper: Paper):Promise<any> {
    return new Promise((resolve, reject) => {
      this.PAPERWF_SC.deployed().then(instance => {
        console.log(paper);
      return instance.submit(paper.location, paper.title, paper.abstract);
      }).then((status) => {
        console.log(status);
        if(status) {
          return resolve({status:true});
        }
      }).catch((error) => {
        console.log(error);
        return reject("Error in transferEther service call");
      });
    });
  }

}
