import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core'
import { Paper } from '@app/shared/models'
import { PublicationService, WorkflowState, AssetStateChanged } from '@app/modules/publication/services/publication.service'
import { AlertService } from '@app/core/services/alert.service'
import { Subscription } from 'rxjs'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss']
})
export class WorkflowsComponent implements OnInit, OnDestroy {

  @Input() paper: Paper
  workflowsState: WorkflowState[]
  stateChangedSubscription: Subscription

  constructor(
    private publicationService: PublicationService,
    private alertService: AlertService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getWorkflowsInfo()

    this.stateChangedSubscription = this.publicationService.getStateChangedPapers()
    .pipe(filter(event => event.assetAddress === this.paper.ethAddress))
    .subscribe((event: AssetStateChanged) => {
      this.getWorkflowsInfo().then(states => {
        this.alertService.success('Paper state updated!')
        this.cd.detectChanges()
      })
    })
  }

  ngOnDestroy() {
    this.stateChangedSubscription.unsubscribe()
  }

  getWorkflowsInfo(): Promise<WorkflowState[]> {
    const promise = this.publicationService.getWorkflowsState(this.paper)
    promise.then(workflowsState => this.workflowsState = workflowsState)
    .catch(error => this.alertService.error('Workflow does not exist or data could no be fetched'))
    return promise
  }

}
