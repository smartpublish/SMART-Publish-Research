import { Component, OnInit } from '@angular/core';
import { PublicationService } from "@app/modules/publication/services/publication.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Test data
  publishedPapers: any[] = [
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."},
    {"title":"Paper 1", "subtitle":"This is a paper", "description": "Lore ipsum ipsum ipsum...."}
  ];

  pendingPaper: any[] = [];

  // TODO Refactor
  pendingPaperSubscription: Subscription;

  constructor(private publicationService: PublicationService) { }

  ngOnInit() {
    // this.publishedPapers = this.paperService.getNewPublished();
    this.pendingPaperSubscription = this.publicationService.getAllPapers("Submitted").subscribe(paper => {
      console.log(paper);
    });
  }

}
