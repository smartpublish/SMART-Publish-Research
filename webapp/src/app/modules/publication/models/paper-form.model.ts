import { FormControl, FormArray, Validators } from '@angular/forms'
import { Paper } from './paper.model'

export class PaperForm {
  ethAddress = new FormControl()
  title = new FormControl()
  abstract = new FormControl()
  file = new FormControl()
  keywords = new FormControl()
  // contributors = new FormArray([])

  constructor(paper?: Paper) {
    if (paper && paper.ethAddress) {
      this.ethAddress.setValue(paper.ethAddress)
    }
    if (paper && paper.title) {
      this.title.setValue(paper.title)
    }
    this.title.setValidators([Validators.required])

    if (paper && paper.abstract) {
      this.abstract.setValue(paper.abstract)
    }
    this.abstract.setValidators([Validators.required])

    if (paper && paper.fileName) {
      this.file.setValue(paper.fileName)
    }
    this.file.setValidators([Validators.required])

    if (paper && paper.keywords) {
      this.keywords.setValue(paper.keywords)
    }
    this.keywords.setValidators([Validators.required])

    /*
    if(paper && paper.contributors) {
      this.contributors.setValue([paper.contributors])
    }
    this.contributors.setValidators([Validators.required])
    */

  }
}
