import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicationService } from "@app/modules/publication/services/publication.service";
import { Subscription } from "rxjs";
import {DataCard} from "@app/shared/layout/cardlist/cardlist.component";
import {Paper} from "@app/modules/publication/models/paper.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  publishedPapers: any[] = [];
  onReviewPapers: any[] = [];
  submittedPapers: any[] = [];

  publishedPapersSubscription: Subscription;
  onReviewPapersSubscription: Subscription;
  submittedPapersSubscription: Subscription;

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    this.publishedPapersSubscription = this.publicationService.getAllPapers("Published").subscribe(paper => {
      this.publishedPapers.push(this.paperToCard(paper,'Read', ''));
    });
    this.onReviewPapersSubscription = this.publicationService.getAllPapers("OnReview").subscribe(paper => {
      this.onReviewPapers.push(this.paperToCard(paper,'Read', 'Accept'));
    });
    this.submittedPapersSubscription = this.publicationService.getAllPapers("Submitted").subscribe(paper => {
      this.submittedPapers.push(this.paperToCard(paper,'Read', 'Review'));
    });
  }

  ngOnDestroy() {
    this.publishedPapersSubscription.unsubscribe();
    this.onReviewPapersSubscription.unsubscribe();
    this.submittedPapersSubscription.unsubscribe();
  }

  clickActionCardHandleSubmitted(event) {
    let paper:Paper = event.item;
    if(event.action_number == 1) {
      window.open(paper['publicLocation'], "_blank");
    } else if(event.action_number == 2) {
      this.publicationService.review(paper).then(() => console.log("Review action done!"));
    }
  }

  clickActionCardHandleOnReview(event) {
    let paper:Paper = event.item;
    if(event.action_number == 1) {
      window.open(paper['publicLocation'], "_blank");
    } else if(event.action_number == 2) {
      this.publicationService.accept(paper).then(() => console.log("Review action done!"));
    }
  }

  clickActionCardHandlePublished(event) {
    let paper:Paper = event.item;
    if(event.action_number == 1) {
      window.open(paper['publicLocation'], "_blank");
    }
  }

  // TODO Refactor
  private paperToCard(paper, action_1_name, action_2_name): DataCard {
    console.log(paper);
    return {
      model: paper,
      title: paper['title'],
      subtitle: paper['ethAddress'],
      description: paper['abstract'],
      action_1_name: action_1_name,
      action_2_name: action_2_name
    } as DataCard;
  };

}
