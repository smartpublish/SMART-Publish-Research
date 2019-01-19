import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'
import { Router, Data } from '@angular/router'
import { AssetStateChanged, PublicationService } from '@app/modules/publication/services/publication.service'
import { Subscription, Observable} from 'rxjs'
import { DataCard, CardlistComponent } from '@app/shared/layout/cardlist/cardlist.component'
import { Paper, Contributor } from '@app/shared/models'
import { map, filter, scan, take } from 'rxjs/operators'
import { MediaService } from '@app/core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    private publicationService: PublicationService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private mediaService: MediaService) {
  }

  lastPaper: Paper
  lastPaperSubsription: Subscription

  papersCardByState$ = {
    'Submitted': null,
    'Published': null
  }
  stateChangedSubscription: Subscription

  ngOnInit() {
    // TODO Refactor
    this.papersCardByState$['Submitted'] = this.publicationService.getAllPapersOnState('Submitted').pipe(
      map(paper => this.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )

    this.papersCardByState$['Published'] = this.publicationService.getAllPapersOnState('Published').pipe(
      map(paper => this.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )

    this.lastPaperSubsription = this.papersCardByState$['Published'].subscribe(papers => {
      this.lastPaper = papers[0].model;
      this.lastPaperSubsription.unsubscribe()
    })

    this.stateChangedSubscription = this.publicationService.getStateChangedPapers()
    .pipe(filter((event: AssetStateChanged) => event.state === 'OnReview' || event.state === 'Published'))
    .subscribe((event: AssetStateChanged) => {
      this.publicationService.getPaper(event.assetAddress).then(paper => {
        // Add the paper to the list
        switch (event.state) {
          case 'Published': {
            this.papersCardByState$['Published'] = this.publicationService.getAllPapersOnState('Published').pipe(
              map(paper => this.paperToCard(paper, 'Read')),
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
            map(paper => this.paperToCard(paper, 'Read')),
            scan<DataCard>((acc, value, index) => [value, ...acc], [])
          )
          break
        }
        case 'Submitted': {
          this.papersCardByState$['Submitted'] = this.publicationService.getAllPapersOnState('Submitted').pipe(
            map(paper => this.paperToCard(paper, 'Read')),
            scan<DataCard>((acc, value, index) => [value, ...acc], [])
          )
          break
        }
      }
      this.cd.detectChanges()
    })

  }

  ngOnDestroy() {
    if(this.stateChangedSubscription) {
      this.stateChangedSubscription.unsubscribe()
    }
    if(this.lastPaperSubsription) {
      this.lastPaperSubsription.unsubscribe()
    }
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

  public paperToCard(paper: Paper, action_1_name): DataCard {
    let image = this.mediaService.searchImage([paper.topic])
    let tags:string[] = paper.keywords.toArray()
    tags.unshift(paper.topic)
    
    return {
      model: paper,
      title: paper.title,
      subtitle: '',
      image: image,
      description: paper.summary,
      action_1_name: action_1_name,
      action_2_name: undefined,
      tags: tags
    } as DataCard
  }

}
