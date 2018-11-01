import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AssetStateChanged, PublicationService } from "@app/modules/publication/services/publication.service";
import { BehaviorSubject, Subscription} from "rxjs";
import { DataCard } from "@app/shared/layout/cardlist/cardlist.component";
import { Paper } from "@app/modules/publication/models/paper.model";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  papersByState = {};

  papersSubmittedSubscription:Subscription;
  papersOnReviewSubscription:Subscription;
  papersPublishedSubscription:Subscription;

  stateChangedSubscription:Subscription;

  papersCardByState$ = {};

  constructor(
    private publicationService: PublicationService,
    private router: Router) {

    this.papersByState['Submitted'] = [];
    this.papersByState['OnReview'] = [];
    this.papersByState['Published'] = [];

    this.papersCardByState$['Submitted'] = new BehaviorSubject<Array<DataCard>>([]);
    this.papersCardByState$['OnReview'] = new BehaviorSubject<Array<DataCard>>([]);
    this.papersCardByState$['Published'] = new BehaviorSubject<Array<DataCard>>([]);
  }

  ngOnInit() {
    this.papersSubmittedSubscription = this.publicationService.getAllPapersOnState("Submitted").pipe(
      map(paper => HomeComponent.paperToCard(paper,'Read', 'Review'))
    ).subscribe(card => {
      this.papersByState['Submitted'].push(card);
      this.papersCardByState$['Submitted'].next(this.papersByState['Submitted']);
    });

    this.papersOnReviewSubscription = this.publicationService.getAllPapersOnState("OnReview").pipe(
      map(paper => HomeComponent.paperToCard(paper,'Read', 'Accept'))
    ).subscribe(card => {
      this.papersByState['OnReview'].push(card);
      this.papersCardByState$['OnReview'].next(this.papersByState['OnReview']);
    });

    this.papersPublishedSubscription = this.publicationService.getAllPapersOnState("Published").pipe(
      map(paper => HomeComponent.paperToCard(paper,'Read', ''))
    ).subscribe(card => {
      this.papersByState['Published'].push(card);
      this.papersCardByState$['Published'].next(this.papersByState['Published']);
    });

    this.stateChangedSubscription = this.publicationService.getStateChangedPapers()
      .subscribe((event:AssetStateChanged) => {
        console.log(event);
        console.log(this.papersByState);
        console.log(this.papersByState[event.oldState]);
        this.deleteItemFromArray(this.papersByState[event.oldState],'subtitle', event.assetAddress);
        console.log(this.papersByState[event.oldState]);
        console.log(this.papersByState[event.state]);
        if('OnReview' === event.state) {
          let card = HomeComponent.paperToCard(event.asset,'Read', 'Accept');
          this.papersByState[event['state']] = [card].concat(this.papersByState[event['state']]);
          this.papersCardByState$[event['state']].next(card);
        } else if('Published' === event.state) {
          let card = HomeComponent.paperToCard(event.asset,'Read', '');
          this.papersByState[event['state']] = [card].concat(this.papersByState[event['state']]);
          this.papersCardByState$[event['state']].next(card);
        }
        console.log(this.papersByState[event.state]);
      }
    );
  }

  private deleteItemFromArray(array:any[], property:any, value:any):any[] {
      const index: number = array.map(e => { return e[property]; }).indexOf(value);
      if (index !== -1) {
        array.splice(index, 1);
      }
      return array;
  }

  ngOnDestroy() {
    this.papersSubmittedSubscription.unsubscribe();
    this.papersOnReviewSubscription.unsubscribe();
    this.papersPublishedSubscription.unsubscribe();
    this.stateChangedSubscription.unsubscribe();
  }

  clickCardHandle(card:DataCard) {
    let paper:Paper = card.model;
    this.router.navigate(['/detail', paper.ethAddress]);
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
  private static paperToCard(paper, action_1_name, action_2_name): DataCard {
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
