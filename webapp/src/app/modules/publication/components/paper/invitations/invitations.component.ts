import { Component, OnInit, Input } from '@angular/core';
import { InvitationService } from '@app/modules/publication/services/invitation.service';
import { ContributorInvitation } from '@app/modules/publication/models'
import { Observable, of } from 'rxjs';
import { scan, catchError } from 'rxjs/operators';
import { Paper } from '@app/modules/publication/models';
import { AlertService } from '@app/core/services';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {

  @Input() paper:Paper;
  invitations$:Observable<ContributorInvitation[]>;

  constructor(
    private invitationService: InvitationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.invitations$ = this.invitationService.getInvitations(this.paper)
    .pipe(
      scan<ContributorInvitation>((acc, value, index) => [value, ...acc], [])
    );
  }

  onNewInvitation(email: string) {
    this.invitationService.send(this.paper, email)
    .pipe(
      catchError(this.handleError<any>('generatePaperContributorInvitation'))
    )
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      this.alertService.error('There was an error with the invitation');
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
