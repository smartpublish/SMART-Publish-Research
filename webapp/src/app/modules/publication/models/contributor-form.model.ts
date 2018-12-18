import { FormControl, Validators } from "@angular/forms";
import { Contributor } from "./contributor.model";

export class ContributorForm {
  email = new FormControl()

  constructor(contributor?: Contributor) {
    if(contributor && contributor.email) {
      this.email.setValue(contributor.email)
    }
    this.email.setValidators([Validators.required])
  }
}