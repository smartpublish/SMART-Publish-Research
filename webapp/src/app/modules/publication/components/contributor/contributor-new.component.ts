import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'app-contributor-new',
  templateUrl: './contributor-new.component.html',
  styleUrls: ['./contributor-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContributorNewComponent implements OnInit {

  @Input() contributorForm: FormGroup
  @Input() index: number
  @Output() deleteContributor: EventEmitter<number> = new EventEmitter()

  constructor() { }

  ngOnInit() {}

  onDelete() {
    this.deleteContributor.emit(this.index)
  }

}
