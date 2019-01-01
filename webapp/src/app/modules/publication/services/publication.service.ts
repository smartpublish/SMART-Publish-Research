import { Injectable } from '@angular/core';
import { Paper, Comment, Contributor } from "../models"
import { EthereumService, IpfsService, AlertService, HashService, AuthenticationService } from "@app/core/services";
import * as TruffleContract from "truffle-contract";
import { Observable } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { ethers, Contract } from 'ethers';

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
    private hashService: HashService,
    private authService: AuthenticationService
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

  async getPaper(address: string): Promise<Paper> {
    let paper_sc = await this.PAPER_SC.at(address);
    let values = await Promise.all([
      paper_sc.title.call(),
      paper_sc.summary.call(),
      paper_sc.getFile.call(0),
      paper_sc.getKeywordsCount.call(),
      paper_sc.getContributors.call(),
      paper_sc.owner.call()
    ]);
    let keywords_count = parseInt(values[3],10)
    let keywords_promises: any = []
    for(let i = 0; i < keywords_count; i++) {
      keywords_promises.push(paper_sc.keywords.call(i));
    }
    let keywords = await Promise.all(keywords_promises)
    return new Paper(
      values[0],
      values[1],
      address,
      null,
      values[2][0],
      values[2][1],
      values[2][2],
      values[2][3],
      keywords.map(item => {return item}) as string[],
      values[4].map(c => { return {ethAddress: c} }) as Contributor[],
      values[5]
    );
  }

  stateChanged:Observable<AssetStateChanged>;
  
  getStateChangedPapers(): Observable<AssetStateChanged> {
    if(!this.stateChanged) {
      this.stateChanged = Observable.create(observer => {
        this.WF_SC.deployed().then(instance => {
          // TODO Filter by asset type
          const event = instance.AssetStateChanged({});
          event.on('data', (data) => {
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

  commentAdded:Observable<AssetCommentAdded>;
  
  getCommentsChangedPapers(): Observable<AssetCommentAdded> {
    if(!this.commentAdded) {
      this.commentAdded = Observable.create(observer => {
        this.WF_SC.deployed().then(instance => {
          // TODO Filter by asset type
          const event = instance.AssetCommentAdded({});
          event.on('data', (data) => {
            let e = {
              assetAddress: data['args']['assetAddress'],
              message: data['args']['message'],
              authorAddress: data['args']['author'],
              timestamp: data['args']['timestamp'],
              state: data['args']['state']
            } as AssetCommentAdded;
            observer.next(e);
          });
        })
      });
    }
    
    return this.commentAdded;
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

  getComments(paper: Paper): Observable<Comment> {
    return Observable.create(observer => {
      let wf;
      this.WF_SC.deployed().then(instance => {
        wf = instance;
        return Promise.all([
          wf.name.call(),
          wf.getCommentsCount.call(paper.ethAddress)
        ])
      }).then(values => {
        let wf_name = values[0];
        let count = values[1];

        // Get current comments
        for(let i = 0; i < count; i++) {
          wf.getComment(paper.ethAddress,i).then(value => 
            observer.next({
              workflow: { name: wf_name, state: value[3] },
              message: value[0],
              author: value[1],
              timestamp: parseInt(value[2],10)
            } as Comment)
          )
        }

        // Update observable from event
        const event = wf.AssetCommentAdded({});
        event.on('data', (data) => {
          let e = {
            workflow: { name: wf_name, state: data['args']['state'] },
            message: data['args']['message'],
            author: data['args']['author'],
            timestamp: parseInt(data['args']['timestamp'],10)
          } as Comment;
          observer.next(e);
        });
      });
    });
  }

  getWorkflowsState(paper:Paper): Promise<WorkflowState[]> {
    return new Promise<WorkflowState[]>((resolve, reject) => {
      // TODO A Paper may be associated to a differente workflows. Just now this by default.
      let wf;
      let workflowsState: WorkflowState[] = [];
      this.WF_SC.deployed().then(workflow => {
        wf = workflow;
        return Promise.all([
          wf.name.call(),
          wf.findStateByAsset.call(paper.ethAddress)
        ]);
      }).then(values => {
        workflowsState.push({name: values[0], state: values[1]} as WorkflowState)
        resolve(workflowsState);
      });
    });
  };

  getWorkflowTransitions(paper: Paper): Promise<WorkflowTransition[]> {
    return new Promise<WorkflowTransition[]>((resolve, reject) => {
      let wf;
      let workflowTransitions: WorkflowTransition[] = [];
      let workflowsState: WorkflowState[] = [];
      Promise.all([
        this.getWorkflowsState(paper),
        this.WF_SC.deployed()
      ]).then(values => {
        workflowsState = values[0];
        wf = values[1];
        return wf.getTransitionsCount.call();
      }).then(count => {
        let length = parseInt(count,10);
        let promises: any = [];
        for(let i = 0; i < length; i++) {
          promises.push(wf.getTransition(i));
        }
        return Promise.all(promises);
      }).then(values => {
        let transitionsFiltered = values.filter(transition => transition[1] === workflowsState[0]['state'] && transition[0].toLowerCase() !== 'publish');
        transitionsFiltered.forEach(transition => workflowTransitions.push({name: transition[0], sourceState: transition[1], targetState: transition[2]}))
        resolve(workflowTransitions);
      })
    });
  }

  async submit(title: string, abstract: string, keywords: string[], file: File): Promise<Paper> {
    let paper = await this.submitToIpfs(title, abstract, file)
    paper = paper.copy(paper.fileSystemName, paper.publicLocation, keywords.map(item => item['value']))
    return this.submitToEth(paper)
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
            h.hash,
            null,
            null,
            null);
            
          resolve(paper);
        }).catch(error => {
          reject(error);
        });
      };

      reader.readAsArrayBuffer(file);
    })
  }

  private submitToEth(paper: Paper): Promise<Paper> {
    return new Promise<Paper>(async (resolve, reject) => {
      const abi = tokenAbiAssetFactory.abi;
      let provider = this.ethereumService.getProvider();
      let truffle_instance = await this.ASSET_FACTORY_SC.deployed()
      let address = truffle_instance.address
      // Uses ethers.js because ABIEncoderV2 does not work with truffle-contract and web3js
      let signer = provider.getSigner()
      let instance = new Contract(address, abi, signer)
      let profile = await this.authService.getProfile()
      let account = await signer.getAddress()
      let filter = instance.filters.AssetCreated(null, null, account)
      instance.on(filter, (asset, type, sender) => {
        console.log('Asset created (' + asset.toString() + '), type: ' + type + ' from sender: ' + sender)
        resolve(new Paper(
          paper.title,
          paper.abstract,
          asset,
          paper.fileName,
          paper.fileSystemName,
          paper.publicLocation,
          paper.summaryHashAlgorithm,
          paper.summaryHash,
          paper.keywords,
          paper.contributors,
          paper.ownerAddress
        ));
      })
  
      try {
        await instance.createPaper(
          paper.title,
          paper.abstract,
          paper.fileSystemName,
          paper.publicLocation,
          paper.summaryHashAlgorithm,
          paper.summaryHash,
          paper.keywords,
          this.WF_SC_INSTANCE.address, // Creates Paper with PeerReviewWorkflow by default
          profile.sub // user_id
        );
      } catch(error) {
        console.log('Failed TX:', error.transactionHash)
        console.error(error)
        reject("Error creating the Paper on Ethereum or procesing the response")
      }
    });
  }

  review(paper: Paper, comment: string): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.review(paper.ethAddress, comment));
  }

  accept(paper: Paper, comment: string): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.accept(paper.ethAddress, comment));
  }

  reject(paper: Paper, comment: string): Promise<any> {
    return this.WF_SC.deployed().then(instance => instance.reject(paper.ethAddress, comment));
  }

  addComment(paper: Paper, message: string): Promise<void> {
    return this.WF_SC.deployed().then(instance => instance.addComment(paper.ethAddress, message));
  }

  search(terms: Observable<string>): Observable<Paper> {
    // TODO Refactor: Search on all papers
    return terms.pipe(
      filter(text => text.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.getAllPapersOnState(term))
    );
  }
}

export interface AssetStateChanged {
  assetAddress: string,
  state: string,
  oldState: string,
  transition: string
  asset: any;
}

export interface AssetCommentAdded {
  assetAddress: string,
  message: string,
  authorAddress: string,
  timestamp: number,
  state: string
}

export interface WorkflowState {
  name: string,
  state: string
  transitions: WorkflowTransition[];
  comments: Comment[];
}

export interface WorkflowTransition {
  name: string,
  sourceState: string,
  targetState: string
}

export interface Workflow {
  workflowAddress: string,
  name: string
}