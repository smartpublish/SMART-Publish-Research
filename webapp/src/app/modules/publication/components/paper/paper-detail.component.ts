import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper } from '../../models/paper.model';
import { PublicationService, WorkflowState } from '../../services/publication.service';
import { AlertService } from '@app/core/services/alert.service';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit {

  paper:Paper;
  workflowsState: WorkflowState[];

  constructor(
    private route:ActivatedRoute,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private router: Router) { }

  ngOnInit() {
    const ethAddr:string = this.route.snapshot.paramMap.get('ethAddr');
    this.getPaper(ethAddr);
    this.getWorkflowsInfo(ethAddr);
  }

  getPaper(address: string) {
    this.publicationService.getPaper(address).then(paper => this.paper = paper).catch(error => {
      this.alertService.error('Paper does not exist or could no be fetched');
      this.router.navigate(['**']);
    });
  }

  getWorkflowsInfo(address: string) {
    this.publicationService.getWorkflowsState(address).then(workflowsState => this.workflowsState = workflowsState).catch(error => {
      this.alertService.error('Workflow does not exist or data could no be fetched');
    });
  }

}

