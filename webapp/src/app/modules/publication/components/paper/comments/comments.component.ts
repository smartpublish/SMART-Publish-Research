import { Component, OnInit, Input } from '@angular/core'
import { AlertService } from '@app/core/services/alert.service'
import { PublicationService } from '@app/modules/publication/services/publication.service'
import { Paper } from '@app/modules/publication/models/paper.model'
import { Comment } from '@app/modules/publication/models/comment.model'
import { Observable, zip } from 'rxjs'
import { scan, mergeMap } from 'rxjs/operators'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input() paper: Paper
  comments$: Observable<Comment[]>

  constructor(
    private publicationService: PublicationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.comments$ = this.publicationService.getComments(this.paper)
    .pipe(
      scan<Comment>((acc, value, index) => [value, ...acc], [])
    )
  }

  onNewComment(message: string) {
    this.publicationService.addComment(this.paper, message)
    .catch(e => this.alertService.error('There was an error with comment: ' + e))
  }

}
