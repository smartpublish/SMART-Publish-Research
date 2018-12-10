import { FormControl, Validators } from "@angular/forms";
import { Contributor } from "./contributor.model";

export class ContributorForm {
  ORCID = new FormControl()

  constructor(contributor?: Contributor) {
    if(contributor && contributor.ORCID) {
      this.ORCID.setValue(contributor.ORCID)
    }
    this.ORCID.setValidators([Validators.required])
  }
}