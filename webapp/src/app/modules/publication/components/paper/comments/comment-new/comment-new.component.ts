import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PublicationService } from '@app/modules/publication/services/publication.service';
import { AlertService } from '@app/core/services/alert.service';

@Component({
  selector: 'app-comment-new',
  templateUrl: './comment-new.component.html',
  styleUrls: ['./comment-new.component.scss']
})
export class CommentNewComponent {

  @Output() comment:EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup;
  message: FormControl = new FormControl('', Validators.required);

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private alertService: AlertService
  ) {
    this.form = fb.group({
      message: this.message
    });
   }

  onSubmit() {
    this.comment.emit(this.message.value);
  }

}