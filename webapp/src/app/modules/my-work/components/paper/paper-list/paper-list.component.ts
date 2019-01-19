import { Component, OnInit } from '@angular/core'
import { DataCard, CardlistComponent } from '@app/shared/layout/cardlist/cardlist.component'
import { Observable } from 'rxjs'
import { MyWorkService } from '@app/modules/my-work/services/my-work.service'
import { Paper } from '@app/shared/models'
import { Router } from '@angular/router'
import { map, scan } from 'rxjs/operators'
import { MediaService } from '@app/core/services';

@Component({
  selector: 'app-my-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit {

  constructor(
    private myWorkService: MyWorkService,
    private mediaService: MediaService,
    private router: Router) { }


  papers_submitted_by_me$: Observable<DataCard[]>
  papers_pending_of_my_approval$: Observable<DataCard[]>

  ngOnInit() {
    this.papers_submitted_by_me$ = this.myWorkService.getMyPapers().pipe(
      map(paper => this.paperToCard(paper, 'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    )
    this.papers_pending_of_my_approval$ = this.myWorkService.getPapersPendingOfMyApproval().pipe(
      map(paper => this.paperToCard(paper, 'Read')),
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

  public paperToCard(paper: Paper, action_1_name): DataCard {
    let image = this.mediaService.searchImage([paper.topic])
    return {
      model: paper,
      title: paper.title,
      subtitle: '',
      image: image,
      description: paper.summary,
      action_1_name: action_1_name
    } as DataCard
  }
}
