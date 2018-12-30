import { Component, OnInit } from '@angular/core';
import { DataCard } from '@app/shared/layout/cardlist/cardlist.component';
import { Observable } from 'rxjs';
import { MyWorkService } from '@app/modules/my-work/services/my-work.service';
import { Paper } from '@app/modules/publication/models';
import { Router } from '@angular/router';
import { map, scan } from 'rxjs/operators';

@Component({
  selector: 'app-my-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.scss']
})
export class PaperListComponent implements OnInit {

  my_papers$:Observable<DataCard[]>

  constructor(
    private myWorkService: MyWorkService,
    private router: Router) { }

  ngOnInit() {
    this.my_papers$ = this.myWorkService.getMyPapers().pipe(
      map(paper => PaperListComponent.paperToCard(paper,'Read')),
      scan<DataCard>((acc, value, index) => [value, ...acc], [])
    );
  }

  clickCardHandle(card:DataCard) {
    let paper:Paper = card.model;
    this.router.navigate(['/detail', paper.ethAddress]);
  }

  clickActionCardHandle(event) {
    let paper:Paper = event.item;
    if(event.action_number == 1) {
      window.open(paper['publicLocation'], "_blank");
    }
  }

  // TODO Refactor
  private static paperToCard(paper, action_1_name): DataCard {
    return {
      model: paper,
      title: paper['title'],
      subtitle: '',
      description: paper['abstract'],
      action_1_name: action_1_name
    } as DataCard;
  };
}
