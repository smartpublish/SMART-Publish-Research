import { Component, OnInit, OnDestroy } from '@angular/core';
import { PublicationService } from "@app/modules/publication/services/publication.service";
import { Subscription } from "rxjs";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  publishedPapers: any[] = [];
  pendingPapers: any[] = [];

  publishedPaperSubscription: Subscription;
  pendingPaperSubscription: Subscription;

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    this.publishedPaperSubscription = this.publicationService.getAllPapers("Published").subscribe(paper => {
      this.pendingPapers.push(HomeComponent.paperToCard(paper));
    });
    this.pendingPaperSubscription = this.publicationService.getAllPapers("Submitted").subscribe(paper => {
      this.pendingPapers.push(HomeComponent.paperToCard(paper));
    });
  }

  ngOnDestroy() {
    this.publishedPaperSubscription.unsubscribe();
    this.pendingPaperSubscription.unsubscribe();
  }

  // TODO Refactor
  private static paperToCard(paper):any {
    console.log(paper);
    return {
      'title': paper['title'],
      'subtitle': paper['ethAddress'],
      'description': paper['abstract'],
      'read-link': paper['publicLocation']
    }
  }

}
