import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, Subject } from 'rxjs'
import { IAsset, Paper, ContributorInvitation } from '@app/shared/models'
import { EthereumService } from '../../../core/services/ethereum.service'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { AuthenticationService } from '@app/core/services'
import { Contract, utils } from 'ethers'

declare let require: any
const tokenAbiContributable = require('@contracts/Contributable.json')

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(
    private ethereumService: EthereumService,
    private router: Router,
    private location: Location,
    private authService: AuthenticationService
  ) {
    this.PROVIDER = this.ethereumService.getProvider()

    // Workaround issue: https://github.com/ethers-io/ethers.js/issues/386
    this.PROVIDER.getBlockNumber().then(number => this.PROVIDER.resetEventsBlock(number + 1))
  }
  private static readonly EXPIRATION_DAYS = 7

  private readonly PROVIDER: any

  invitations$: Subject<ContributorInvitation> = new Subject<ContributorInvitation>()

  getInvitations(paper: Paper): Observable<ContributorInvitation> {
    // TODO Calcule 'fromblock'
    const instance = new Contract(paper.ethAddress, tokenAbiContributable.abi, this.PROVIDER)
    //this.PROVIDER.resetEventsBlock(0)
    const filter = instance.filters.InvitationCreated(paper.ethAddress, null, null)
    instance.on(filter, (asset, hashCode, expires) => {
      this.invitations$.next({
        expires: new Date(expires * 1000),
        hashCode: hashCode
      } as ContributorInvitation)
    })

    return this.invitations$.asObservable()
  }

  send(asset: IAsset, email: string): Observable<ContributorInvitation> {
    this.buildContributorInvitation(asset, email).then(async invitation => {
      invitation = await this.createInvitationOnEthereum(invitation)
      this.invitations$.next(invitation)
    })

    return this.invitations$.asObservable()
  }

  validate(invitation: ContributorInvitation) {
    if (invitation.expires > new Date()) {
      throw new Error('Invitation expired')
    }
  }

  async join(invitation: ContributorInvitation): Promise<any> {
    const profile = await this.authService.getProfile()
    return this.joinOnEthereum(invitation, profile.sub)
  }

  async isOwner(paper: Paper): Promise<boolean> {
    const signer = await this.PROVIDER.getSigner()
    const account = await signer.getAddress()
    return account.toUpperCase() === paper.ownerAddress.toUpperCase()
  }

  private async joinOnEthereum(invitation: ContributorInvitation, user_id: string): Promise<any> {
    const address = await this.ethereumService.getSCAddress(tokenAbiContributable)
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(address, tokenAbiContributable.abi, signer)
    return await instance.join(invitation.token, user_id)
  }

  private async createInvitationOnEthereum(invitation: ContributorInvitation): Promise<ContributorInvitation> {
    const hashedCode = await utils.solidityKeccak256(['string'], [invitation.token])
    invitation.hashCode = hashedCode
    const signer = this.PROVIDER.getSigner()
    const instance = new Contract(invitation.asset.ethAddress, tokenAbiContributable.abi, signer)
    let expires = invitation.expires.getTime() / 1000
    await instance.addInvitation(hashedCode, expires)
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

  private async getTimestampFromEthereum(): Promise<Date> {
    const lastBlockNumber = await this.PROVIDER.getBlockNumber()
    let block = await this.PROVIDER.getBlock(lastBlockNumber)
    const expires = block.timestamp + 24 * 60 * 60
    return new Date(expires * 1000)
  }

  private async buildContributorInvitation(asset: IAsset, email: string): Promise<ContributorInvitation> {
    const now = await this.getTimestampFromEthereum()
    const expires = new Date(now.getTime())
    expires.setDate(expires.getDate() + InvitationService.EXPIRATION_DAYS)

    const invitation = {
      guest: { email: email },
      asset: asset,
      code: this.generateCode(),
      expires: expires,
      created: now
    } as ContributorInvitation

    const token: string = this.generateToken(invitation)
    const link: string = window.location.origin + '/' +
      this.location.prepareExternalUrl(
        this.router.createUrlTree(['/detail', asset.ethAddress, {invitation: token}]).toString())

    const href_mailto = new URLSearchParams()
    href_mailto.set('subject', 'You were invited to contribute on a Paper!')
    href_mailto.set('body', link)

    invitation.token = token
    invitation.link = link
    invitation.link_mailto = href_mailto.toString()

    return invitation
  }

}
