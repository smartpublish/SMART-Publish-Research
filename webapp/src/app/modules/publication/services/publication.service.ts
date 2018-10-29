import { Injectable } from '@angular/core';
import { EthereumService } from "@app/core/services/ethereum.service";
import { Paper } from "@app/modules/publication/models/paper.model";
import * as TruffleContract from "truffle-contract";
import { Observable } from "rxjs";
import { IpfsService } from "@app/core/services/ipfs.service";
import { AlertService } from "@app/core/services/alert.service";

declare let require: any;

let tokenAbiPeerReviewWorkflow = require('@contracts/PeerReviewWorkflow.json');
let tokenAbiAssetFactory = require('@contracts/AssetFactory.json');
let tokenAbiPaper = require('@contracts/Paper.json');

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  readonly WF_SC = TruffleContract(tokenAbiPeerReviewWorkflow);
  readonly ASSET_FACTORY_SC = TruffleContract(tokenAbiAssetFactory);
  readonly PAPER_SC = TruffleContract(tokenAbiPaper);

  constructor(
    private ethereumService: EthereumService,
    private ipfsService: IpfsService,
    private alertService: AlertService
  ) {

    this.WF_SC.setProvider(ethereumService.web3Provider);
    this.ASSET_FACTORY_SC.setProvider(ethereumService.web3Provider);
    this.PAPER_SC.setProvider(ethereumService.web3Provider);

    // Init defaults
    this.ethereumService.getAccountInfo().then((acctInfo : any) => {
      this.WF_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.ASSET_FACTORY_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.PAPER_SC.defaults({
        from: acctInfo.fromAccount
      })
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  getAllPapers(state: string): Observable<any[]> {
    return Observable.create(observer => {
      this.WF_SC.deployed().then(instance => {
        // TODO Filter by asset type
        return instance.findAssetsByState.call(state);
      }).then(addresses => {
        console.log(addresses);
        addresses.forEach((address) => {
          console.log(address);
          this.PAPER_SC.at(address).then(instance => {
            return Promise.all([
              instance.title.call(),
              instance.summary.call(),
              instance.getFile.call(0)
            ]);
          }).then(values => {
            console.log(values);
            let paper:Paper = new Paper(
              values[0],
              values[1],
              null,
              values[2][1],
              values[2][0],
              address);
            observer.next(paper);
          }).catch(err => console.log(err));
        });
      });
    });
  }

  submit(paper: Paper) {
    return this.submitToIpfs(paper).then((ipfsObject) => {
      if(ipfsObject) {
        paper.publicLocation = ipfsObject['link'];
        paper.fileSystemName = 'IPFS';
        console.log(paper);
        return this.submitToEthereum(paper)
      }
    });
  }

  private submitToIpfs(paper: Paper):Promise<any> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
        }, 10000);

        let reader = new FileReader();
        reader.onload = (event) => {
          this.ipfsService.upload(event.target['result'])
            .then((ipfsObject) => {
              try {
                resolve({
                  hash: ipfsObject,
                  link: 'https://ipfs.io/ipfs/' + ipfsObject
                });
              } catch(e) {
                reject(e);
              }
            });
        };
        reader.readAsArrayBuffer(paper.file);
      })
  }

  private submitToEthereum(paper: Paper):Promise<any> {
    return new Promise((resolve, reject) => {
      this.ASSET_FACTORY_SC.deployed().then(instance => {
        console.log(paper);
      return instance.createPaper(
        paper.title,
        paper.abstract,
        paper.fileSystemName,
        paper.publicLocation,
        paper.summaryHashAlgorithm,
        paper.summaryHash,
        this.WF_SC.address // Creates Paper with PeerReviewWorkflow by default
        );
      }).then((status) => {
        console.log(status);
        if(status) {
          return resolve({ status:true });
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }

  review(paper: Paper):Promise<any> {
    return new Promise((resolve, reject) => {
      this.WF_SC.deployed().then(instance => {
        return instance.review(paper.ethAddress);
      }).then((status) => {
        console.log(status);
        if(status) {
          return resolve({ status:true });
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }

  accept(paper: Paper):Promise<any> {
    return new Promise((resolve, reject) => {
      this.WF_SC.deployed().then(instance => {
        return instance.accept(paper.ethAddress);
      }).then((status) => {
        console.log(status);
        if(status) {
          return resolve({ status:true });
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }
}
