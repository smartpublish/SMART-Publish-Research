import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Paper } from '../../models/paper.model'
import { PublicationService } from '../../services/publication.service'
import { AlertService } from '@app/core/services/alert.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit, OnDestroy {

  paper: Paper
  urlChangesSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {
    this.urlChangesSub = this.route.params.subscribe(params => {
      this.getPaper(params['ethAddr'])
    })
  }

  ngOnDestroy() {
    this.urlChangesSub.unsubscribe()
  }

  getPaper(address: string) {
    this.publicationService.getPaper(address).then(paper => this.paper = paper).catch(error => {
      console.error(error)
      this.alertService.error('Paper does not exist or could no be fetched')
      this.router.navigate(['home'])
    })
  }

}

