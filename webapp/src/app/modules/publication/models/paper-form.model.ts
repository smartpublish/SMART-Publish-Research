import { FormControl, FormArray, Validators } from '@angular/forms'
import { Paper } from '@app/shared/models'

export class PaperForm {
  ethAddress = new FormControl()
  title = new FormControl()
  summary = new FormControl()
  abstract = new FormControl()
  file = new FormControl()
  topic = new FormControl()
  keywords = new FormControl()
  contributors = new FormArray([])

  constructor(paper?: Paper) {
    if (paper) {
      paper.ethAddress? this.ethAddress.setValue(paper.ethAddress) : null
      paper.title? this.title.setValue(paper.title) : null
      paper.summary? this.summary.setValue(paper.summary) : null
      paper.abstract? this.abstract.setValue(paper.abstract) : null
      paper.fileName? this.file.setValue(paper.fileName) : null
      paper.topic? this.topic.setValue(paper.topic) : null
      paper.keywords? this.keywords.setValue(paper.keywords) : null
      paper.contributors? this.contributors.setValue([paper.contributors]) : null
    }
    
    this.title.setValidators([Validators.required])
    this.summary.setValidators([Validators.required])
    this.abstract.setValidators([Validators.required])
    this.file.setValidators([Validators.required])
    this.topic.setValidators([Validators.required])
    this.keywords.setValidators([Validators.required])
    this.contributors.setValidators([Validators.required])
  }
}
