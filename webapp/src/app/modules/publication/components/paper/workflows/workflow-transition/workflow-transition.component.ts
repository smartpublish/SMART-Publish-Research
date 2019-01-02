import { Component, OnInit, Input } from '@angular/core'
import { Paper } from '@app/modules/publication/models/paper.model'
import { PublicationService, WorkflowTransition, WorkflowState } from '@app/modules/publication/services/publication.service'
import { AlertService } from '@app/core/services/alert.service'

@Component({
  selector: 'app-workflow-transition',
  templateUrl: './workflow-transition.component.html',
  styleUrls: ['./workflow-transition.component.scss']
})
export class WorkflowTransitionComponent implements OnInit {

  @Input() paper: Paper
  @Input() workflowState: WorkflowState[]
  transitions$: Promise<WorkflowTransition[]>

  constructor(
    private publicationService: PublicationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.transitions$ = this.publicationService.getWorkflowTransitions(this.paper)
  }

  onWorkflowTransition(transition: any, comment: any) {
    // TODO Improve it to use dynamic action names.
    switch (transition.name.toLowerCase()) {
      case 'accept': this.publicationService.accept(this.paper, comment); break
      case 'review': this.publicationService.review(this.paper, comment); break
      case 'reject': this.publicationService.reject(this.paper, comment); break
      default: this.alertService.error('Transition: ' + transition.name + ' is not valid.')
    }
  }
}
