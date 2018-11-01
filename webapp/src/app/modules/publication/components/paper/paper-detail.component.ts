import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Paper } from '../../models/paper.model';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {

  paper:Paper;

  constructor(
    private route:ActivatedRoute,
    private publicationService: PublicationService) { }

  ngOnInit() {
    this.getPaper();
  }

  getPaper() {
    const ethAddr:string = this.route.snapshot.paramMap.get('ethAddr');
    this.publicationService.getPaper(ethAddr).then(paper => this.paper = paper);
  }

}
