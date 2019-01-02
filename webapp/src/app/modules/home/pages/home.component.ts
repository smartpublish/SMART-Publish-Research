import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core'
import { Router } from '@angular/router'
import { AssetStateChanged, PublicationService } from '@app/modules/publication/services/publication.service'
import { BehaviorSubject, Subscription} from 'rxjs'
import { DataCard } from '@app/shared/layout/cardlist/cardlist.component'
import { Paper } from '@app/modules/publication/models/paper.model'
import { map, filter, scan } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private cd: ChangeDetectorRef) {
  }


  papersCardByState$ = {
    'Submitted': null,
    'OnReview': null,
    'Published': null
  }
  stateChangedSubscription: Subscription

  // TODO Refactor
  private static paperToCard(paper, action_1_name): DataCard {
    return {
      model: paper,
      title: paper['title'],
      subtitle: '',
      description: paper['abstract'],
      action_1_name: action_1_name
    } as DataCard
  }
  ngOnInit() {
    // TODO Refactor
    this.papersCardByState$['Submitted'] = this.publicationService.getAllPapersOnState('Submitted').pipe(
      map(paper => HomeComponent.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )

    this.papersCardByState$['OnReview'] = this.publicationService.getAllPapersOnState('OnReview').pipe(
      map(paper => HomeComponent.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )

    this.papersCardByState$['Published'] = this.publicationService.getAllPapersOnState('Published').pipe(
      map(paper => HomeComponent.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )

    this.stateChangedSubscription = this.publicationService.getStateChangedPapers()
    .pipe(filter((event: AssetStateChanged) => event.state === 'OnReview' || event.state === 'Published'))
    .subscribe((event: AssetStateChanged) => {
      this.publicationService.getPaper(event.assetAddress).then(paper => {
        // Add the paper to the list
        switch (event.state) {
          case 'OnReview': {
            this.papersCardByState$['OnReview'] = this.publicationService.getAllPapersOnState('OnReview').pipe(
              map(paper => HomeComponent.paperToCard(paper, 'Read')),
              scan<DataCard>((acc, value, index) => [value, ...acc], [])
            )
            break
          }
          case 'Published': {
            this.papersCardByState$['Published'] = this.publicationService.getAllPapersOnState('Published').pipe(
              map(paper => HomeComponent.paperToCard(paper, 'Read')),
              scan<DataCard>((acc, value, index) => [value, ...acc], [])
            )
            break
          }
        }
        this.cd.detectChanges()
      })
      // Remove paper from old list
      switch (event.oldState) {
        case 'OnReview': {
          this.papersCardByState$['OnReview'] = this.publicationService.getAllPapersOnState('OnReview').pipe(
            map(paper => HomeComponent.paperToCard(paper, 'Read')),
            scan<DataCard>((acc, value, index) => [value, ...acc], [])
          )
          break
        }
        case 'Submitted': {
          this.papersCardByState$['Submitted'] = this.publicationService.getAllPapersOnState('Submitted').pipe(
            map(paper => HomeComponent.paperToCard(paper, 'Read')),
            scan<DataCard>((acc, value, index) => [value, ...acc], [])
          )
          break
        }
      }
      this.cd.detectChanges()
    })

  }

  ngOnDestroy() {
    this.stateChangedSubscription.unsubscribe()
  }

  clickCardHandle(card: DataCard) {
    const paper: Paper = card.model
    this.router.navigate(['/detail', paper.ethAddress])
  }

  clickActionCardHandle(event) {
    const paper: Paper = event.item
    if (event.action_number === 1) {
      window.open(paper['publicLocation'], '_blank')
    }
  }

}
