import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { FormGroup, FormArray } from '@angular/forms'
import { PublicationService } from '@app/modules/publication/services/publication.service'
import { Paper, PaperJson } from '@app/shared/models'
import { AlertService } from '@app/core/services/alert.service'
import { Subscription } from 'rxjs'
import { PublicationFormService } from '../../services/publication-form.service'
import { Set } from 'immutable'

@Component({
  selector: 'app-paper-new',
  templateUrl: './paper-new.component.html',
  styleUrls: ['./paper-new.component.scss']
})
export class PaperNewComponent implements OnInit, OnDestroy {

  paperForm: FormGroup
  paperFormSub: Subscription
  contributorsForm: FormArray
  formInvalid = false
  file: File
  topics: string[]

  constructor(
    private publicationService: PublicationService,
    private publicationFormService: PublicationFormService,
    private alertService: AlertService,
    private router: Router) {
  }

  onFileChange($event) {
    this.file = $event.target.files[0]
  }

  onSubmit() {
    let paper = Paper.fromJSON({...this.paperForm.value} as PaperJson)
    paper = Paper.builder(paper).keywords(Set(
      this.paperForm.get('keywords').value.map(item => item['value']))
    ).build()
    
    this.publicationService.submit(paper, this.file).then((paper: Paper) => {
      this.paperForm.reset()
      this.router.navigate(['/detail', paper.ethAddress])
      this.alertService.success('Congratulation! Your paper was submitted correctly. Just wait for reviewers')
    }).catch(error => this.alertService.error(error))
  }

  ngOnInit() {
    this.topics = this.publicationFormService.getTopicsOption()
    this.paperFormSub = this.publicationFormService.paperForm$
      .subscribe(form => {
          this.paperForm = form
          this.contributorsForm = this.paperForm.get('contributors') as FormArray
        })
  }

  ngOnDestroy() {
    this.paperFormSub.unsubscribe()
  }

  addContributor() {
    this.publicationFormService.addContributor()
  }

  deleteContributor(index: number) {
    this.publicationFormService.deleteContributor(index)
  }

}
