import { Injectable } from '@angular/core';
import { EmailService } from './email.service';
import { environment } from '@env/environment';
import { Observable, Subject } from 'rxjs';
import { IAsset, Paper } from '@app/modules/publication/models';
import { AuthenticationService } from './authentication.service';
import TruffleContract from "truffle-contract";
import { EthereumService } from './ethereum.service';

declare let require: any;

let tokenAbiInvitable = require('@contracts/Invitable.json');

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  private readonly INV_SC = TruffleContract(tokenAbiInvitable);

  constructor(
    private ethereumService: EthereumService,
    private authService: AuthenticationService,
    private emailService: EmailService
  ) { 
    this.INV_SC.setProvider(ethereumService.web3Provider);
    this.ethereumService.getAccountInfo().then((acctInfo: any) => {
      this.INV_SC.defaults({
        from: acctInfo.fromAccount
      });
    });
  }

  invitations$: Subject<ContributorInvitation> = new Subject<ContributorInvitation>();

  getInvitations(paper: Paper): Observable<ContributorInvitation> {
    // TODO Implement server method to get current invitations
    return this.invitations$.asObservable();
  }

  send(asset: IAsset, email: string): Observable<ContributorInvitation> {
    // let invitation = this.buildContributorInvitation(asset, email);
    // this.sendEmail(invitation).subscribe(e=>console.log(e));
    // return Observable.create(observer => observer.next(this.buildContributorInvitation(asset, email)))
    let invitation:ContributorInvitation = this.buildContributorInvitation(asset, email);
    this.createInvitationOnEthereum(asset, invitation.token).then(expires => {
      invitation.expires = expires;
      this.invitations$.next(invitation);
    })
    return this.invitations$.asObservable();
  }

  private async createInvitationOnEthereum(asset: IAsset, code: string):Promise<Date> {
    let web3 = this.ethereumService.getWeb3();
    let hashedCode = await web3.utils.soliditySha3(code)
    let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
    let expires = block.timestamp + 24 * 60 * 60
    let instance = await this.INV_SC.at(asset.ethAddress)
    let tx = await instance.createInvitation(hashedCode, expires)
    return new Date(expires * 1000);
  }

  private generateToken():string {
    // TODO Refactor to include timestamp and paper data
    return Math.floor(100000 + Math.random() * 900000) + '';
  }

  private buildContributorInvitation(asset: IAsset, email: string): ContributorInvitation {
    let token:string = this.generateToken();
    let link:string = environment.base_url + '/' + token;

    let href_mailto = new URLSearchParams();
    href_mailto.set('subject', 'You were invited to contribute on a Paper!');
    href_mailto.set('body', link);

    return {
      guest: { email: email },
      asset: { title: asset['title'] },
      token: token,
      link: link,
      link_mailto: 'mailto:' + email + '?' + href_mailto.toString()
    } as ContributorInvitation;
  }

  /**
   * Send an invitation to the contributor
   * @param {ContributorInvitation} invitation The invitation data
   * @returns The token invitation code
   */
  /*
  private sendEmail(invitation: ContributorInvitation):Observable<any> {
    let link = environment.base_url + '/' + invitation.token;
    return this.emailService.send(
      'SMART Papers <invitations@smart-papers.org>',
      invitation.guest.email,
      invitation.host.full_name + ' invited you to contribute on: ' + invitation.asset.title,
      'Click on this link to join into the paper: ' + link
    );
  }
 */
}

export interface Invitation {

}

export interface ContributorInvitation extends Invitation {
  guest: {
    email: string
  },
  asset: {
    title: string
  },
  token: string,
  link: string,
  link_mailto: string,
  expires: Date
}