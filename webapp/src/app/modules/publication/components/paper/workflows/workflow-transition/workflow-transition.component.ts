import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { Paper } from '@app/modules/publication/models/paper.model'
import { PublicationService, WorkflowTransition, WorkflowState, Approval } from '@app/modules/publication/services/publication.service'
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
  approval$: Promise<Approval>
  @ViewChild('approvalModal') modalRef: ModalComponent

  constructor(
    private publicationService: PublicationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.approval$ = this.publicationService.getMyWorkflowApproval(this.paper)
    this.transitions$ = this.publicationService.getWorkflowTransitions(this.paper)
      .then(transitions => this.checkPermission(transitions))
  }

  onWorkflowTransition(transition: any) {
    // TODO Improve it to use dynamic action names.
    switch (transition.name.toLowerCase()) {
      case 'review': 
        this.publicationService.review(this.paper)
        .then(() => {
          this.ngOnInit()
          this.alertService.success("Congratulations! You are now a reviewer")
        })
        .catch(error => this.alertService.error(error))
        break
      default: this.alertService.error('Transition: ' + transition.name + ' is not valid.')
    }
  }

  onWorkflowApproval(action: any, comment: any) {
    switch (action.toLowerCase()) {
      case 'accept': 
        this.publicationService.accept(this.paper, comment)
        .then(() => {
          this.modalRef.close()
          this.ngOnInit()
          this.alertService.success("Yay! You accepted this paper")
        })
        .catch(error => this.alertService.error(error))
        break
      case 'reject':
        this.publicationService.reject(this.paper, comment)
        .then(() => {
          this.modalRef.close()
          this.ngOnInit()
          this.alertService.success("You rejected this paper")
        })
        .catch(error => this.alertService.error(error))
        break
      default: this.alertService.error('Approval action: ' + action + ' failed.')
    }
  }

  // TODO Refactory by other global permission solution. 
  // Eg: https://github.com/AlexKhymenko/ngx-permissions
  async checkPermission(transitions: WorkflowTransition[]): Promise<WorkflowTransition[]> {
    let transitionsAllowed: WorkflowTransitionPermissionsChecked[] = []
    for(let transition of transitions) {
      let t:WorkflowTransitionPermissionsChecked = {...transition, allowed: false}
      switch(transition.permission) {
        case 0: {
          t.allowed = true
          break
        }
        case 1: {
          t.allowed = await this.publicationService.isOwner(this.paper)
          break
        }
        case 2: {
          t.allowed = !await this.publicationService.isOwner(this.paper)
          break
        }
        default: { 
          t.allowed = false
          break
        }
      }
      transitionsAllowed.push(t)
    }
    return transitionsAllowed
  }
}

interface WorkflowTransitionPermissionsChecked extends WorkflowTransition {
  allowed:boolean;
}
