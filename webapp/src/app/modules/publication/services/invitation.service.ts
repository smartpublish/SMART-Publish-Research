import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, Subject } from 'rxjs'
import { IAsset, Paper, ContributorInvitation } from '@app/modules/publication/models'
import TruffleContract from "truffle-contract"
import { EthereumService } from '../../../core/services/ethereum.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { AuthenticationService } from '@app/core/services';

declare let require: any

let tokenAbiContributable = require('@contracts/Contributable.json')

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private readonly INV_SC = TruffleContract(tokenAbiContributable)
  private static readonly EXPIRATION_DAYS = 7

  constructor(
    private ethereumService: EthereumService,
    private router: Router,
    private location: Location,
    private authService: AuthenticationService
  ) { 
    this.INV_SC.setProvider(ethereumService.web3Provider)
    this.ethereumService.getAccountInfo().then((acctInfo: any) => {
      this.INV_SC.defaults({
        from: acctInfo.fromAccount
      });
    });
  }

  invitations$: Subject<ContributorInvitation> = new Subject<ContributorInvitation>();

  getInvitations(paper: Paper): Observable<ContributorInvitation> {
    // TODO Calcule 'fromblock'
    this.INV_SC.at(paper.ethAddress).then(function(instance) {
      return instance.getPastEvents('InvitationCreated',{
        filter: {},
        fromBlock: 0,
        toBlock: 'latest'
      });
    }).then(result => {
      result.forEach(event => {
        this.invitations$.next({
          expires: new Date(event.args.expires * 1000),
          hashCode: event.args.hashCode
        } as ContributorInvitation)
      });
    });
    return this.invitations$.asObservable()
  }

  send(asset: IAsset, email: string): Observable<ContributorInvitation> {
    this.buildContributorInvitation(asset, email).then(async invitation => {
      invitation = await this.createInvitationOnEthereum(invitation)
      this.invitations$.next(invitation)
    });
    
    return this.invitations$.asObservable()
  }

  validate(invitation: ContributorInvitation) {
    if(invitation.expires > new Date()) {
      throw new Error('Invitation expired')
    }
  }
  
  async join(invitation: ContributorInvitation):Promise<any> {
    let profile = await this.authService.getProfile()
    return this.joinOnEthereum(invitation, profile.sub)
  }

  async isOwner(paper: Paper): Promise<boolean> {
    let accountInfo: any = await this.ethereumService.getAccountInfo()
    return accountInfo.fromAccount.toUpperCase() === paper.ownerAddress.toUpperCase()
  }

  private async joinOnEthereum(invitation: ContributorInvitation, user_id: string):Promise<any> {
    let instance = await this.INV_SC.at(invitation.asset.ethAddress)
    return await instance.join(invitation.token, user_id)
  }

  private async createInvitationOnEthereum(invitation: ContributorInvitation):Promise<ContributorInvitation> {
    let web3 = this.ethereumService.getWeb3();
    let hashedCode = await web3.utils.soliditySha3(invitation.token)
    invitation.hashCode = hashedCode
    let instance = await this.INV_SC.at(invitation.asset.ethAddress)
    let tx = await instance.addInvitation(hashedCode, invitation.expires.getTime() / 1000)
    return invitation
  }

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000) + ''
  }

  private generateToken(invitation: ContributorInvitation): string {
    return btoa(JSON.stringify({
      asset: {
        ethAddress: invitation.asset.ethAddress
      },
      code: invitation.code,
      created: invitation.created,
      expires: invitation.expires
    }))
  }

  private async getTimestampFromEthereum():Promise<Date> {
    let web3 = this.ethereumService.getWeb3();
    let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
    let expires = block.timestamp + 24 * 60 * 60
    return new Date(expires * 1000);
  }

  private async buildContributorInvitation(asset:IAsset, email:string): Promise<ContributorInvitation> {
    let now = await this.getTimestampFromEthereum()
    let expires = new Date(now.getTime())
    expires.setDate(expires.getDate() + InvitationService.EXPIRATION_DAYS)

    let invitation = {
      guest: { email: email },
      asset: asset,
      code: this.generateCode(),
      expires: expires,
      created: now
    } as ContributorInvitation

    let token:string = this.generateToken(invitation)
    let link:string = environment.base_url + '/' +
      this.location.prepareExternalUrl(
        this.router.createUrlTree(['/detail', asset.ethAddress, {invitation: token}]).toString())
    
    let href_mailto = new URLSearchParams()
    href_mailto.set('subject', 'You were invited to contribute on a Paper!')
    href_mailto.set('body', link)

    invitation.token = token
    invitation.link = link
    invitation.link_mailto = href_mailto.toString()

    return invitation
  }
  
}
