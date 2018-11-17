import {Injectable} from '@angular/core';
import {EthereumService} from "@app/core/services/ethereum.service";
import {Paper} from "@app/modules/publication/models/paper.model";
import * as TruffleContract from "truffle-contract";
import {Observable} from "rxjs";
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

  readonly WF_SC = TruffleContract(tokenAbiPeerReviewWorkflow); // TODO A Paper may be associated to a different workflows. Just now this by default but should be dynamic.
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
          instance.getFile.call(0)
        ]);
      }).then(values => {
        let paper: Paper = new Paper(
          values[0],
          values[1],
          address,
          null,
          values[2][0],
          values[2][1],
          values[2][2],
          values[2][3]
          );

        resolve(paper);
      }).catch(err => {
        reject(err)
      });
    });
  }

  stateChanged:Observable<AssetStateChanged>;
  
  getStateChangedPapers(): Observable<AssetStateChanged> {
    if(!this.stateChanged) {
      this.stateChanged = Observable.create(observer => {
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
    
    return this.stateChanged;
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

  getWorkflowsState(address: string): Promise<WorkflowState[]> {
    return new Promise<WorkflowState[]>((resolve, reject) => {
      // TODO A Paper may be associated to a differente workflows. Just now this by default.
      let wf;
      let workflowsState: WorkflowState[] = [];
      this.WF_SC.deployed().then(workflow => {
        wf = workflow;
        return Promise.all([
          wf.name.call(),
          wf.findStateByAsset.call(address)
        ]);
      }).then(values => {
        workflowsState.push({name: values[0], state: values[1]} as WorkflowState)
        return wf.getTransitionsCount();
      }).then(count => {
        let promises: any = [];
        for(let i = 0; i < count; i++) {
          promises.push(wf.getTransition(i));
        }
        return Promise.all(promises);
      }).then(values => {
        let transitionsFiltered = values.filter(transition => transition[1] === workflowsState[0]['state'] && transition[0].toLowerCase() !== 'publish');
        workflowsState[0].transitions = [];
        transitionsFiltered.forEach(transition => workflowsState[0].transitions.push({name: transition[0], sourceState: transition[1], targetState: transition[2]}))
        resolve(workflowsState);
      });
    });
  };

  submit(title: string, abstract: string, file: File): Promise<Paper> {
    return this.submitToIpfs(title, abstract, file).then((paper) => this.submitToEthereum(paper));
  }

  private submitToIpfs(title:string, abstract: string, file: File): Promise<Paper> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      }, 10000);

      let reader = new FileReader();
      reader.onload = (event) => {
        Promise.all([
          this.ipfsService.upload(event.target['result']),
          this.hashService.hash(file)
        ]).then(values => {
          let ipfsObject = values[0];
          let h = values[1];
          
          let paper = new Paper(
            title,
            abstract,
            null,
            file.name, //TODO check this, ipfsObject (ipfs hash) is not better?
            'IPFS',
            'https://ipfs.io/ipfs/' + ipfsObject,
            h.hashAlgorithm,
            h.hash);
            
          resolve(paper);
        }).catch(error => {
          reject(error);
        });
      };

      reader.readAsArrayBuffer(file);
    })
  }

  private submitToEthereum(paper: Paper): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ASSET_FACTORY_SC.deployed().then(instance => {
      return instance.createPaper(
        paper.title,
        paper.abstract,
        paper.fileSystemName,
        paper.publicLocation,
        paper.summaryHashAlgorithm,
        paper.summaryHash,
        this.WF_SC_INSTANCE.address // Creates Paper with PeerReviewWorkflow by default
        );
      }).then((result) => {
        console.log(result);
        let paperCreatedEvent = result.logs.filter(
          log => log['event'] === 'AssetCreated' && log.args['assetType'] === 'paper' && log.args['assetAddress']
        );
        if(paperCreatedEvent && paperCreatedEvent.length == 1) {
          return resolve(new Paper(
            paper.title,
            paper.abstract,
            paperCreatedEvent[0].args['assetAddress'],
            paper.fileName,
            paper.fileSystemName,
            paper.publicLocation,
            paper.summaryHashAlgorithm,
            paper.summaryHash
          ));
        }
      }).catch((error) => {
        console.error(error);
        return reject("Error creating the Paper on Ethereum or procesing the response");
      });
    });
  }

  review(paper: Paper): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.review(paper.ethAddress));
  }

  accept(paper: Paper): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.accept(paper.ethAddress));
  }

  reject(paper: Paper): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.reject(paper.ethAddress));
  }
}

export interface AssetStateChanged {
  assetAddress: string,
  state: string,
  oldState: string,
  transition: string
  asset: any;
}

export interface WorkflowState {
  name: string,
  state: string
  transitions: WorkflowTransition[];
}

export interface WorkflowTransition {
  name: string,
  sourceState: string,
  targetState: string
}