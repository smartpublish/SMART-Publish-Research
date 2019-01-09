import { Injectable } from '@angular/core'
import { Paper, Comment, Contributor } from '../models'
import { EthereumService, IpfsService, HashService, AuthenticationService } from '@app/core/services'
import { Observable, merge } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'
import { Contract } from 'ethers'
import { Set } from 'immutable'

declare let require: any

const tokenAbiPeerReviewWorkflow = require('@contracts/PeerReviewWorkflow.json')
const tokenAbiAssetFactory = require('@contracts/AssetFactory.json')
const tokenAbiPaper = require('@contracts/Paper.json')

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

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


  private readonly PROVIDER: any

  stateChanged: Observable<AssetStateChanged>

  commentAdded: Observable<AssetCommentAdded>

  async getPaper(address: string): Promise<Paper> {
    const instance = new Contract(address, tokenAbiPaper.abi, this.PROVIDER)
    const values = await Promise.all([
      instance.title(),
      instance.summary(),
      instance.abstrakt(),
      instance.getFile(0),
      instance.topic(),
      instance.getKeywordsCount(),
      instance.getContributors(),
      instance.owner()
    ])
    const keywords_count = parseInt(values[5], 10)
    const keywords_promises: any = []
    for (let i = 0; i < keywords_count; i++) {
      keywords_promises.push(instance.keywords(i))
    }
    const keywords = await Promise.all(keywords_promises)
    return Paper.builder()
      .ethAddress(address)
      .title(values[0])
      .summary(values[1])
      .abstract(values[2])
      .fileSystemName(values[3][0])
      .publicLocation(values[3][1])
      .summaryHashAlgorithm(values[3][2])
      .summaryHash(values[3][3])
      .topic(values[4])
      .keywords(Set(keywords.map(item => item) as string[]))
      .contributors(Set(values[6].map(c => ({ethAddress: c})) as Contributor[]))
      .ownerAddress(values[7])
      .build()
  }

  getStateChangedPapers(): Observable<AssetStateChanged> {
    if (!this.stateChanged) {
      this.stateChanged = Observable.create(async observer => {
        const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)

        // TODO Filter by asset type
        const filter = instance.filters.AssetStateChanged()
        instance.on(filter, async (assetAddress, state, oldState, transition) => {
          console.log('Asset state changed (' + assetAddress + ', ' + state + ', ' + oldState + ', ' + transition + ')')
          const paper = await this.getPaper(assetAddress)
          observer.next({
            assetAddress: assetAddress,
            state: state,
            oldState: oldState,
            transition: transition,
            asset: paper
          } as AssetStateChanged)
        })
      })
    }

    return this.stateChanged
  }

  getCommentsChangedPapers(): Observable<AssetCommentAdded> {
    if (!this.commentAdded) {
      this.commentAdded = Observable.create(async observer => {
        const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
        const filter = instance.filters.AssetStateChanged()
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
        })
      })
    }
    return this.commentAdded
  }

  getAllPapersOnState(state: string): Observable<Paper> {
    return Observable.create(async observer => {
      const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
      const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
      // TODO Filter by asset type
      const addresses = await instance.findAssetsByState(state)
      addresses.forEach(async address => {
        const paper = await this.getPaper(address)
        observer.next(paper)
      })
    })
  }

  getComments(paper: Paper): Observable<Comment> {
    return Observable.create(async observer => {
      const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
      const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
      const values = await Promise.all([
        instance.name(),
        instance.getCommentsCount(paper.ethAddress)
      ])
      const wf_name = values[0]
      const count = values[1]

      // Get current comments
      for (let i = 0; i < count; i++) {
        const comment = await instance.getComment(paper.ethAddress, i)
        observer.next({
          workflow: { name: wf_name, state: comment[3] },
          message: comment[0],
          author: comment[1],
          timestamp: parseInt(comment[2], 10)
        } as Comment)
      }

      // Update observable from event
      const filter = instance.filters.AssetCommentAdded(paper.ethAddress, null, null, null, null)
      instance.on(filter, (asset, message, author, timestamp, state) => {
        console.log('Asset Comment Added (' + asset + ', ' + state + ', ' + message + ', ' + author + ', ' + timestamp + ')')
        observer.next({
          workflow: { name: wf_name, state: state },
          message: message,
          author: author,
          timestamp: parseInt(timestamp, 10)
        } as Comment)
      })
    })
  }

  async getWorkflowsState(paper: Paper): Promise<WorkflowState[]> {
    // TODO A Paper may be associated to a differente workflows. Just now this by default.
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
    const values = await Promise.all([
      instance.name(),
      instance.findStateByAsset(paper.ethAddress)
    ])
    const workflowsState: WorkflowState[] = []
    workflowsState.push({name: values[0], state: values[1]} as WorkflowState)
    return workflowsState
  }
  
  async getWorkflowTransitions(paper: Paper): Promise<WorkflowTransition[]> {
    // TODO A Paper may be associated to a differente workflows. Just now this by default.
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
    const workflowsState = await this.getWorkflowsState(paper)
    const count = await instance.getTransitionsCount()
    const length = parseInt(count, 10)
    const promises: any = []
    for (let i = 0; i < length; i++) {
      promises.push(instance.getTransition(i))
    }
    const values = await Promise.all(promises)
    // Filter transitions of current state and not INTERNAL 
    const transitionsFiltered = values.filter(transition => transition[1] === workflowsState[0]['state'] && transition[3] !== 3)
    const workflowTransitions: WorkflowTransition[] = transitionsFiltered.map(
      transition => ({name: transition[0], sourceState: transition[1], targetState: transition[2], permission: transition[3]}))
    return workflowTransitions
  }

  async getMyWorkflowApproval(paper: Paper): Promise<Approval> {
    // TODO A Paper may be associated to a differente workflows. Just now this by default.
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, this.PROVIDER)
    const workflowsState = await this.getWorkflowsState(paper)
    const account = await this.PROVIDER.getSigner()
    let values: any[] = await instance.getApprovalByAsset(paper.ethAddress, workflowsState[0]['state'], account.getAddress())
    let status = 'Pending'
    if(values[2] === 1 ) { 
      status = 'Approved'
    } else if(values[2] === 2) {
      status = 'Rejected'
    }
    let approval: Approval = {
      approver : values[0],
      approvalType: values[1],
      status: status,
      actions: [values[3], values[4]]
    } as Approval
    // When action does not exist, it returns an empty approval
    return approval.approver === "0x0000000000000000000000000000000000000000"? null : approval;
  }

  async submit(paper:Paper, file: File): Promise<Paper> {
    let ipfs:FileDefinition = await this.submitToIpfs(file)
    paper = Paper.builder(paper)
      .fileName(ipfs.fileName)
      .fileSystemName(ipfs.fileSystemName)
      .summaryHashAlgorithm(ipfs.summaryHashAlgorithm)
      .summaryHash(ipfs.summaryHash)
      .publicLocation(ipfs.publicLocation)
      .build()
    return this.submitToEth(paper)
  }
  
  private submitToIpfs(file: File): Promise<FileDefinition> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
      }, 10000)

      const reader = new FileReader()
      reader.onload = (event) => {
        Promise.all([
          this.ipfsService.upload(event.target['result']),
          this.hashService.hash(file)
        ]).then(values => {
          const ipfsObject = values[0]
          const h = values[1]
          resolve({
            fileName: file.name, // TODO check this, ipfsObject (ipfs hash) is not better?
            fileSystemName: 'IPFS',
            publicLocation: 'https://ipfs.io/ipfs/' + ipfsObject,
            summaryHashAlgorithm: h.hashAlgorithm,
            summaryHash: h.hash 
          } as FileDefinition)
        }).catch(error => {
          reject(error)
        })
      }

      reader.readAsArrayBuffer(file)
    })
  }

  private submitToEth(paper: Paper): Promise<Paper> {
    return new Promise<Paper>(async (resolve, reject) => {
      // Uses ethers.js because ABIEncoderV2 does not work with truffle-contract and web3js
      const address = await this.ethereumService.getSCAddress(tokenAbiAssetFactory)
      const signer = this.PROVIDER.getSigner()
      const instance = new Contract(address, tokenAbiAssetFactory.abi, signer)
      const profile = await this.authService.getProfile()
      const account = await signer.getAddress()
      const filter = instance.filters.AssetCreated(null, null, account)
      instance.on(filter, (asset, type, sender) => {
        console.log('Asset created (' + asset.toString() + '), type: ' + type + ' from sender: ' + sender)
        resolve(Paper.builder(paper).ethAddress(asset).build())
      })

      try {
        const address_wf = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
        await instance.createPaper(
          paper.title,
          paper.summary,
          paper.abstract,
          paper.fileSystemName,
          paper.publicLocation,
          paper.summaryHashAlgorithm,
          paper.summaryHash,
          paper.topic,
          paper.keywords.toArray(),
          address_wf, // Creates Paper with PeerReviewWorkflow by default
          profile.sub // user_id
        )
      } catch (error) {
        console.log('Failed TX:', error.transactionHash)
        console.error(error)
        reject('Error creating the Paper on Ethereum or procesing the response')
      }
    })
  }

  async review(paper: Paper): Promise<any> {
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return await instance.review(paper.ethAddress)
  }

  async accept(paper: Paper, comment: string): Promise<any> {
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return await instance.accept(paper.ethAddress, comment)
  }

  async reject(paper: Paper, comment: string): Promise<any> {
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return await instance.reject(paper.ethAddress, comment)
  }

  async addComment(paper: Paper, message: string): Promise<void> {
    const address = await this.ethereumService.getSCAddress(tokenAbiPeerReviewWorkflow)
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(address, tokenAbiPeerReviewWorkflow.abi, signer)
    return instance.addComment(paper.ethAddress, message)
  }

  getPapersByKeywords(keywords: string[]): Observable<Paper> {
    return Observable.create(async observer => {
      // Uses ethers.js because ABIEncoderV2 does not work with truffle-contract and web3js
      const address = await this.ethereumService.getSCAddress(tokenAbiAssetFactory)
      const instance = new Contract(address, tokenAbiAssetFactory.abi, this.PROVIDER)
      const assets = await instance.getAssetsByKeywords(keywords)
      assets.forEach(async asset => {
        const paper = await this.getPaper(asset)
        observer.next(paper)
      })
    })
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
    )
  }

  async isOwner(paper: Paper): Promise<boolean> {
    const signer = await this.PROVIDER.getSigner()
    const account = await signer.getAddress()
    return account.toUpperCase() === paper.ownerAddress.toUpperCase()
  }
}

export interface AssetStateChanged {
  assetAddress: string,
  state: string,
  oldState: string,
  transition: string
  asset: any
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
  transitions: WorkflowTransition[]
  comments: Comment[]
}

export interface WorkflowTransition {
  name: string,
  sourceState: string,
  targetState: string,
  permission: number
}

export interface Workflow {
  workflowAddress: string,
  name: string
}

export interface FileDefinition {
  fileName: string
  fileSystemName: string
  publicLocation: string
  summaryHashAlgorithm: string
  summaryHash: string
}

export interface Approval {
  approver: string;
  approvalType: string,
  status: string,
  actions: string[]
}