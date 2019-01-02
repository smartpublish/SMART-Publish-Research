import { Injectable } from '@angular/core'
import { Paper, Comment, Contributor } from "../models"
import { EthereumService, IpfsService, HashService, AuthenticationService } from "@app/core/services"
import { Observable, merge } from "rxjs"
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Contract } from 'ethers'

declare let require: any;

let tokenAbiPeerReviewWorkflow = require('@contracts/PeerReviewWorkflow.json');
let tokenAbiAssetFactory = require('@contracts/AssetFactory.json');
let tokenAbiPaper = require('@contracts/Paper.json');

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  private readonly PROVIDER:any

  constructor(
    private ethereumService: EthereumService,
    private ipfsService: IpfsService,
    private hashService: HashService,
    private authService: AuthenticationService
  ) {
    this.PROVIDER = this.ethereumService.getProvider()

    // Workaround issue: https://github.com/ethers-io/ethers.js/issues/386
    this.PROVIDER.getBlockNumber().then(number => this.PROVIDER.resetEventsBlock(number + 1))
  }

  async getPaper(address: string): Promise<Paper> {
    let instance = new Contract(address, tokenAbiPaper.abi, this.PROVIDER)
    let values = await Promise.all([
      instance.title(),
      instance.summary(),
      instance.getFile(0),
      instance.getKeywordsCount(),
      instance.getContributors(),
      instance.owner()
    ]);
    let keywords_count = parseInt(values[3],10)
    let keywords_promises: any = []
    for(let i = 0; i < keywords_count; i++) {
      keywords_promises.push(instance.keywords(i));
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
      this.stateChanged = Observable.create(async observer => {
        let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
        
        // TODO Filter by asset type
        let filter = instance.filters.AssetStateChanged()
        instance.on(filter, async (assetAddress, state, oldState, transition) => {
          console.log('Asset state changed (' + assetAddress + ', ' + state + ', ' + oldState + ', ' + transition + ')')
          let paper = await this.getPaper(assetAddress)
          observer.next({
            assetAddress: assetAddress,
            state: state,
            oldState: oldState,
            transition: transition,
            asset: paper
          } as AssetStateChanged)
        });
      });
    }
    
    return this.stateChanged;
  }

  commentAdded:Observable<AssetCommentAdded>;
  
  getCommentsChangedPapers(): Observable<AssetCommentAdded> {
    if(!this.commentAdded) {
      this.commentAdded = Observable.create(async observer => {
        let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
        let filter = instance.filters.AssetStateChanged();
        instance.on(filter, async (assetAddress, message, authorAddress, timestamp, state) => {
          console.log('Comment Added (' + assetAddress + ', ' + message + ', ' + authorAddress + ', ' 
          + timestamp + ', ' + state + ')')
          observer.next({
            assetAddress: assetAddress,
            message: message,
            authorAddress: authorAddress,
            timestamp: timestamp,
            state: state
          } as AssetCommentAdded)
        });
      });
    }
    return this.commentAdded
  }

  getAllPapersOnState(state: string): Observable<Paper> {
    return Observable.create(async observer => {
      let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
      let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
      // TODO Filter by asset type
      let addresses = await instance.findAssetsByState(state);
      addresses.forEach(async address => {
        let paper = await this.getPaper(address)
        observer.next(paper)
      });
    });
  }

  getComments(paper: Paper): Observable<Comment> {
    return Observable.create(async observer => {
      let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
      let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
      let values = await Promise.all([
        instance.name(),
        instance.getCommentsCount(paper.ethAddress)
      ]);
      let wf_name = values[0];
      let count = values[1];

      // Get current comments
      for(let i = 0; i < count; i++) {
        let comment = await instance.getComment(paper.ethAddress,i)
        observer.next({
          workflow: { name: wf_name, state: comment[3] },
          message: comment[0],
          author: comment[1],
          timestamp: parseInt(comment[2],10)
        } as Comment)
      }

      // Update observable from event
      let filter = instance.filters.AssetCommentAdded(paper.ethAddress, null, null, null, null)
      instance.on(filter, (asset, message, author, timestamp, state) => {
        console.log('Asset Comment Added (' + asset + ', ' + state + ', ' + message + ', ' + author + ', ' + timestamp + ')')
        observer.next({
          workflow: { name: wf_name, state: state },
          message: message,
          author: author,
          timestamp: parseInt(timestamp,10)
        } as Comment)
      });
    });
  }

  async getWorkflowsState(paper:Paper): Promise<WorkflowState[]> {
    // TODO A Paper may be associated to a differente workflows. Just now this by default.
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
    let values = await Promise.all([
      instance.name(),
      instance.findStateByAsset(paper.ethAddress)
    ]);
    let workflowsState: WorkflowState[] = [];
    workflowsState.push({name: values[0], state: values[1]} as WorkflowState)
    return workflowsState;
  };

  async getWorkflowTransitions(paper: Paper): Promise<WorkflowTransition[]> {    
    // TODO A Paper may be associated to a differente workflows. Just now this by default.
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
    let workflowsState = await this.getWorkflowsState(paper)
    let count = await instance.getTransitionsCount()
    let length = parseInt(count,10);
    let promises: any = [];
    for(let i = 0; i < length; i++) {
      promises.push(instance.getTransition(i));
    }
    let values = await Promise.all(promises);
    let transitionsFiltered = values.filter(transition => transition[1] === workflowsState[0]['state'] && transition[0].toLowerCase() !== 'publish')
    let workflowTransitions: WorkflowTransition[] = transitionsFiltered.map(transition => {return {name: transition[0], sourceState: transition[1], targetState: transition[2]}})
    return workflowTransitions;
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
      // Uses ethers.js because ABIEncoderV2 does not work with truffle-contract and web3js
      let address = await this.ethereumService.getSCAddress(tokenAbiAssetFactory)
      let signer = this.PROVIDER.getSigner()
      let instance = new Contract(address, tokenAbiAssetFactory.abi, signer)
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
        let address_wf = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        await instance.createPaper(
          paper.title,
          paper.abstract,
          paper.fileSystemName,
          paper.publicLocation,
          paper.summaryHashAlgorithm,
          paper.summaryHash,
          paper.keywords,
          address_wf, // Creates Paper with PeerReviewWorkflow by default
          profile.sub // user_id
        );
      } catch(error) {
        console.log('Failed TX:', error.transactionHash)
        console.error(error)
        reject("Error creating the Paper on Ethereum or procesing the response")
      }
    });
  }

  async review(paper: Paper, comment: string): Promise<any> {
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let signer = this.PROVIDER.getSigner()
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return instance.review(paper.ethAddress, comment)
  }

  async accept(paper: Paper, comment: string): Promise<any> {
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let signer = this.PROVIDER.getSigner()
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return instance.accept(paper.ethAddress, comment)
  }

  async reject(paper: Paper, comment: string): Promise<any> {
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let signer = this.PROVIDER.getSigner()
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return instance.reject(paper.ethAddress, comment)
  }

  async addComment(paper: Paper, message: string): Promise<void> {
    let address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    let signer = this.PROVIDER.getSigner()
    let instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return instance.addComment(paper.ethAddress, message)
  }

  getPapersByKeywords(keywords:string[]): Observable<Paper> {
    return Observable.create(async observer => {
      // Uses ethers.js because ABIEncoderV2 does not work with truffle-contract and web3js
      let address = await this.ethereumService.getSCAddress(tokenAbiAssetFactory)
      let instance = new Contract(address, tokenAbiAssetFactory.abi, this.PROVIDER)
      let assets = await instance.getAssetsByKeywords(keywords)
      assets.forEach(async asset => {
        let paper = await this.getPaper(asset)
        observer.next(paper)
      });
    });
  }

  search(terms: Observable<string>): Observable<Paper> {
    // TODO Refactor: Search on title and abstract
    return terms.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => merge(
          this.getPapersByKeywords([term]),
          this.getAllPapersOnState(term)
        )
      )
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