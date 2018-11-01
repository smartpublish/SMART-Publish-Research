import {Injectable} from '@angular/core';
import {EthereumService} from "@app/core/services/ethereum.service";
import {Paper} from "@app/modules/publication/models/paper.model";
import * as TruffleContract from "truffle-contract";
import {Observable, merge} from "rxjs";
import {IpfsService} from "@app/core/services/ipfs.service";
import {AlertService} from "@app/core/services/alert.service";
import {HashService} from "@app/core/services/hash.service";

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

  WF_SC_INSTANCE;
  ASSET_FACTORY_SC_INSTANCE;

  constructor(
    private ethereumService: EthereumService,
    private ipfsService: IpfsService,
    private alertService: AlertService,
    private hashService: HashService
  ) {
    this.WF_SC.setProvider(ethereumService.web3Provider);
    this.ASSET_FACTORY_SC.setProvider(ethereumService.web3Provider);
    this.PAPER_SC.setProvider(ethereumService.web3Provider);

    // Init defaults
    this.ethereumService.getAccountInfo().then((acctInfo: any) => {
      this.WF_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.ASSET_FACTORY_SC.defaults({
        from: acctInfo.fromAccount
      });
      this.PAPER_SC.defaults({
        from: acctInfo.fromAccount
      });

      this.ASSET_FACTORY_SC.deployed().then(instance => this.ASSET_FACTORY_SC_INSTANCE = instance);
      this.WF_SC.deployed().then(instance => this.WF_SC_INSTANCE = instance);
    }).catch((e) => {
      this.alertService.error(e);
    });
  }

  getPaper(address: string): Promise<Paper> {
    return new Promise<Paper>((resolve, reject) => {
      this.PAPER_SC.at(address).then(instance => {
        return Promise.all([
          instance.title.call(),
          instance.summary.call(),
          instance.fileSystemName.call(),
          instance.publicLocation.call(),
          instance.summaryHashAlgorithm.call(),
          instance.summaryHash.call(),
        ]);
      }).then(values => {
        let paper: Paper = new Paper(
          values[0],
          values[1],
          address,
          '', values[2], values[3], values[4], values[5]);

        resolve(paper);
      }).catch(err => reject(err));
    });
  }

  getStateChangedPapers(): Observable<AssetStateChanged> {
    return Observable.create(observer => {
      this.WF_SC.deployed().then(instance => {
        // TODO Filter by asset type
        const event = instance.AssetStateChanged({});
        event.on('data', (data) => {
          console.log(data);
          this.getPaper(data['args']['assetAddress']).then(paper => {
            let e = {
              assetAddress: data['args']['assetAddress'],
              state: data['args']['state'],
              oldState: data['args']['oldState'],
              transition: data['args']['transition'],
              asset: paper
            } as AssetStateChanged;
            observer.next(e);
          });
        });
      })
    });
  }

  getAllPapersOnState(state: string): Observable<Paper> {
    return Observable.create(observer => {
      this.WF_SC.deployed().then(instance => {
        // TODO Filter by asset type
        return instance.findAssetsByState.call(state);
      }).then(addresses => {
        addresses.forEach((address) => this.getPaper(address).then((paper) => observer.next(paper)));
      });
    });
  }

  submit(title: string, abstract: string, file: File) {
    return this.submitToIpfs(title, abstract, file)
      .then(this.submitToEthereum);
  }

  private submitToIpfs(title:string, abstract: string, file: File): Promise<Paper> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      }, 10000);

      let reader = new FileReader();
      reader.onload = (event) => {
        this.ipfsService.upload(event.target['result'])
          .then((ipfsObject) => {
            try {

              let h = this.hashService.hash(file);
              let paper =  new Paper(
                title,
                abstract,
                "",
                file.name, //TODO check this, ipfsObject (ipfs hash) is not better?
                'IPFS',
                'https://ipfs.io/ipfs/' + ipfsObject,
                h.hashAlgorithm,
                h.hash);

              resolve(paper);
            } catch (e) {
              reject(e);
            }
          });
      };
      reader.readAsArrayBuffer(file);
    })
  }

  private submitToEthereum(paper: Paper): Promise<any> {
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
          this.WF_SC_INSTANCE.address // Creates Paper with PeerReviewWorkflow by default
        );
      }).then((status) => {
        console.log(status);
        if (status) {
          return resolve({status: true});
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }

  review(paper: Paper): Promise<any> {
    return new Promise((resolve, reject) => {
      this.WF_SC.deployed().then(instance => {
        return instance.review(paper.ethAddress);
      }).then((status) => {
        console.log(status);
        if (status) {
          return resolve({status: true});
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }

  accept(paper: Paper): Promise<any> {
    return new Promise((resolve, reject) => {
      this.WF_SC.deployed().then(instance => {
        return instance.accept(paper.ethAddress);
      }).then((status) => {
        console.log(status);
        if (status) {
          return resolve({status: true});
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error in transferEther service call");
      });
    });
  }
}

export interface AssetStateChanged {
  assetAddress: string,
  state: string,
  oldState: string,
  transition: string
  asset: any;
}
