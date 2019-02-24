import { FormControl, Validators } from '@angular/forms'
import { Contributor } from '@app/shared/models'

export class ContributorForm {
  ethAddress = new FormControl()
  email = new FormControl()
  fullName = new FormControl()
  type = new FormControl()

  constructor(contributor?: Contributor) {
    if(contributor) {
      contributor.fullName? this.fullName.setValue(contributor.fullName) : null
      contributor.email? this.email.setValue(contributor.email) : null
      contributor.ethAddress? this.ethAddress.setValue(contributor.ethAddress) : null
      contributor.type? this.type.setValue(contributor.type) : null
    }
    
    this.fullName.setValidators([Validators.required])
    this.email.setValidators([Validators.required])
    this.type.setValidators([Validators.required])
  }
}
