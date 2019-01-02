import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

@Component({
  selector: 'app-invitation-new',
  templateUrl: './invitation-new.component.html',
  styleUrls: ['./invitation-new.component.scss']
})
export class InvitationNewComponent implements OnInit {

  @Output() email: EventEmitter<string> = new EventEmitter<string>()
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  onSubmit() {
    const emailFormControl = this.form.get('email')
    this.email.emit(emailFormControl.value)
    emailFormControl.reset()
  }

}
