import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper } from '../../models/paper.model';
import { PublicationService } from '../../services/publication.service';
import { AlertService } from '@app/core/services/alert.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {

  paper:Paper;

  constructor(
    private route:ActivatedRoute,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {
    this.getPaper(this.route.snapshot.paramMap.get('ethAddr'));
  }

  getPaper(address: string) {
    this.publicationService.getPaper(address).then(paper => this.paper = paper).catch(error => {
      this.alertService.error('Paper does not exist or could no be fetched');
      this.router.navigate(['**']);
    });
  }

}

