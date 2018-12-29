import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { ContributorInvitation } from '@app/modules/publication/models';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent implements OnInit {

  @Input() invitations$:Observable<ContributorInvitation[]>;

  constructor(
    private sanitizeService: DomSanitizer
  ) { }

  sanitize(url:string){
    return this.sanitizeService.bypassSecurityTrustUrl(url);
  }

  ngOnInit() {
  }

}
