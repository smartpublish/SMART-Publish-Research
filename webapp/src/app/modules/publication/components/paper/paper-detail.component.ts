import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper } from '../../models/paper.model';
import { PublicationService, WorkflowState, WorkflowTransition } from '../../services/publication.service';
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

  onWorkflowTranstion(transition:any, $event:any) {
    // TODO Improve to make it dynamic values.
    $event.stopPropagation();
    switch(transition.name.toLowerCase()) {
      case 'accept': this.publicationService.accept(this.paper).then(() => this.getWorkflowsInfo(this.paper.ethAddress)); break;
      case 'review': this.publicationService.review(this.paper).then(() => this.getWorkflowsInfo(this.paper.ethAddress)); break;
      case 'reject': this.publicationService.reject(this.paper).then(() => this.getWorkflowsInfo(this.paper.ethAddress)); break;
      default: this.alertService.error('Transition: ' + transition.name + ' is not valid.');
    }
  }
}

