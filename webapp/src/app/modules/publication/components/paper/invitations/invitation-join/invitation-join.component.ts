import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ContributorInvitation } from '@app/shared/models'
import { ActivatedRoute } from '@angular/router'
import { AlertService, AuthenticationService } from '@app/core/services'
import { InvitationService } from '@app/modules/publication/services/invitation.service'
import { AlertComponent } from 'ngx-bootstrap/alert'

@Component({
  selector: 'app-invitation-join',
  templateUrl: './invitation-join.component.html',
  styleUrls: ['./invitation-join.component.scss']
})
export class InvitationJoinComponent implements OnInit {

  invitation: ContributorInvitation
  @ViewChild('alert') alertRef: AlertComponent

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private invitationService: InvitationService,
    private authService: AuthenticationService) { }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('invitation')
    if (!token) {
      return
    }
    try {
      this.invitation = this.parseInvitation(token)
      this.invitation.token = token
      this.invitationService.validate(this.invitation)
    } catch (e) {
      this.alertService.error(e)
    }
  }

  private parseInvitation(token: string) {
    try {
      return JSON.parse(atob(token)) as ContributorInvitation
    } catch (e) {
      this.alertService.error(e)
    }
  }

  onJoin() {
    this.invitationService.join(this.invitation)
    .then(e => {
      this.alertService.success('You are now a Contributor!')
      this.alertRef.close()
    })
    .catch(e => this.alertService.error(e))
  }

}
