import { Component, OnInit } from '@angular/core'
import { DataCard } from '@app/shared/layout/cardlist/cardlist.component'
import { Observable } from 'rxjs'
import { MyWorkService } from '@app/modules/my-work/services/my-work.service'
import { Paper } from '@app/modules/publication/models'
import { Router } from '@angular/router'
import { map, scan } from 'rxjs/operators'
import { PublicationService } from '@app/modules/publication/services/publication.service';

@Component({
  selector: 'app-my-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit {

  constructor(
    private myWorkService: MyWorkService,
    private router: Router) { }


  papers_submitted_by_me$: Observable<DataCard[]>
  papers_pending_of_my_approval$: Observable<DataCard[]>

  // TODO Refactor
  private static paperToCard(paper, action_1_name): DataCard {
    return {
      model: paper,
      title: paper['title'],
      subtitle: '',
      description: paper['summary'],
      action_1_name: action_1_name
    } as DataCard
  }
  ngOnInit() {
    this.papers_submitted_by_me$ = this.myWorkService.getMyPapers().pipe(
      map(paper => PaperListComponent.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )
    this.papers_pending_of_my_approval$ = this.myWorkService.getPapersPendingOfMyApproval().pipe(
      map(paper => PaperListComponent.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )
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
