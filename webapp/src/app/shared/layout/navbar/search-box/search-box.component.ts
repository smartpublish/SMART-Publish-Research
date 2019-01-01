import { Component, OnInit, } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Paper } from '@app/modules/publication/models';
import { PublicationService } from '@app/modules/publication/services/publication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  searchTerm$ = new Subject<string>();
  results$: Observable<Paper[]>;

  constructor(
    private publicationService: PublicationService,
    private router: Router) {
  }
  
  ngOnInit() {
    this.results$ = this.publicationService.search(this.searchTerm$).pipe(
      scan<Paper>((acc, value, index) => [value, ...acc], []))
  }

  onClickResult(paper:Paper, $event) {
    $event.stopPropagation()
    this.router.navigate(['/detail', paper.ethAddress])
  }

  search($event) {
    $event.stopPropagation()
    this.searchTerm$.next($event.target.value)
  }

}
