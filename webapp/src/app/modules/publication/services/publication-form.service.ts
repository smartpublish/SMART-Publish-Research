import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms'
import { Paper, PaperForm, Contributor, ContributorForm } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PublicationFormService {

  private paperForm: BehaviorSubject<FormGroup | undefined> = 
    new BehaviorSubject(this.fb.group(new PaperForm()))

  paperForm$: Observable<FormGroup> = this.paperForm.asObservable()

  constructor(private fb: FormBuilder) {}

  addContributor() {
    const currentPaper = this.paperForm.getValue()
    const currentContributors = currentPaper.get('contributors') as FormArray
    currentContributors.push(
      this.fb.group(
        new ContributorForm()
      )
    )
    this.paperForm.next(currentPaper)
  }

  deleteContributor(i: number) {
    const currentPaper = this.paperForm.getValue()
    const currentContributors = currentPaper.get('contributors') as FormArray
    currentContributors.removeAt(i)
    this.paperForm.next(currentPaper)
  }

}
