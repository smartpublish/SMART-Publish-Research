import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { Paper } from '@app/modules/publication/models/paper.model'
import { PublicationService, WorkflowTransition, WorkflowState } from '@app/modules/publication/services/publication.service'
import { AlertService } from '@app/core/services/alert.service'
import { ModalComponent } from '@app/shared/layout/modal/modal.component';

@Component({
  selector: 'app-workflow-transition',
  templateUrl: './workflow-transition.component.html',
  styleUrls: ['./workflow-transition.component.scss']
})
export class WorkflowTransitionComponent implements OnInit {

  @Input() paper: Paper
  @Input() workflowState: WorkflowState[]
  transitions$: Promise<WorkflowTransition[]>
  @ViewChild('transitionModal') modalRef: ModalComponent

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
      case 'accept': 
        this.publicationService.accept(this.paper, comment)
        .then(() => this.modalRef.close())
        .catch(error => this.alertService.error(error))
        break
      case 'review': 
        this.publicationService.review(this.paper, comment)
        .then(() => this.modalRef.close())
        .catch(error => this.alertService.error(error))
        break
      case 'reject':
        this.publicationService.reject(this.paper, comment)
        .then(() => this.modalRef.close())
        .catch(error => this.alertService.error(error))
        break
      default: this.alertService.error('Transition: ' + transition.name + ' is not valid.')
    }
  }
}
