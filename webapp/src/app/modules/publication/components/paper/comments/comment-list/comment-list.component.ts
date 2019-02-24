import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentListComponent implements OnInit {

  @Input() comments$: Observable<Comment[]>

  constructor() {
  }

  ngOnInit() {

  }

}
