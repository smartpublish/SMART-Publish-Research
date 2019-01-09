import { Component, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.scss']
})
export class CommentNewComponent {

  @Output() comment: EventEmitter<string> = new EventEmitter<string>()
  form: FormGroup

  constructor(
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      message: ['', Validators.required]
    })
   }

  onSubmit() {
    this.comment.emit(this.form.get('message').value)
  }

}
