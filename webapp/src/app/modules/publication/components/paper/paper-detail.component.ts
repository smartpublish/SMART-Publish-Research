import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paper } from '../../models/paper.model';
import { PublicationService, WorkflowState, AssetStateChanged } from '../../services/publication.service';
import { AlertService } from '@app/core/services/alert.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-paper-detail',
  templateUrl: './paper-detail.component.html',
  styleUrls: ['./paper-detail.component.scss']
})
export class PaperDetailComponent implements OnInit, OnDestroy {

  paper:Paper;
  workflowsState: WorkflowState[];
  stateChangedSubscription:Subscription;

  constructor(
    private route:ActivatedRoute,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private router: Router,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    const ethAddr:string = this.route.snapshot.paramMap.get('ethAddr');
    this.getPaper(ethAddr);
    this.getWorkflowsInfo(ethAddr);
    
    this.stateChangedSubscription = this.publicationService.getStateChangedPapers()
    .pipe(filter(event => event.assetAddress === ethAddr))
    .subscribe((event:AssetStateChanged) => {
      this.getWorkflowsInfo(event.assetAddress).then(states => {
        this.alertService.success('Paper state updated!');
        this.cd.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    this.stateChangedSubscription.unsubscribe();
  }

  getPaper(address: string) {
    this.publicationService.getPaper(address).then(paper => this.paper = paper).catch(error => {
      this.alertService.error('Paper does not exist or could no be fetched');
      this.router.navigate(['**']);
    });
  }

  getWorkflowsInfo(address: string):Promise<WorkflowState[]> {
    let promise = this.publicationService.getWorkflowsState(address)
    promise.then(workflowsState => this.workflowsState = workflowsState)
    .catch(error => this.alertService.error('Workflow does not exist or data could no be fetched'));
    return promise;
  }

  onWorkflowTranstion(transition:any, $event:any) {
    // TODO Improve it to use dynamic action names.
    $event.stopPropagation();
    switch(transition.name.toLowerCase()) {
      case 'accept': this.publicationService.accept(this.paper); break;
      case 'review': this.publicationService.review(this.paper); break;
      case 'reject': this.publicationService.reject(this.paper); break;
      default: this.alertService.error('Transition: ' + transition.name + ' is not valid.');
    }
  }
}

