import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { FormGroup, FormBuilder, FormArray } from '@angular/forms'
import { PaperForm, ContributorForm } from '../models'
import { Contributor, ContributorType } from '@app/shared/models';
import { EthereumService, AuthenticationService } from '@app/core/services';

@Injectable({
  providedIn: 'root'
})
export class PublicationFormService {

  private paperForm: BehaviorSubject<FormGroup | undefined> =
    new BehaviorSubject(this.fb.group(new PaperForm()))

  paperForm$: Observable<FormGroup> = this.paperForm.asObservable()
  defaultAuthor$: Promise<Contributor>

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private ethereumService: EthereumService) {

    this.defaultAuthor$ = new Promise(async (resolve, reject) => {
      let profile = await this.authService.getProfile()
      let ethAccount = await this.ethereumService.getProvider().getSigner().getAddress()  
      let defaultContributor = new Contributor(ethAccount, profile['name'], ContributorType.AUTHOR, profile['email'])
      this.addContributor(defaultContributor)
      resolve(defaultContributor)
    })
  }

  addContributor(contributor?: Contributor) {
    const currentPaper = this.paperForm.getValue()
    const currentContributors = currentPaper.get('contributors') as FormArray

    if(contributor &&
      contributor.type == ContributorType.AUTHOR && 
      currentContributors.value.some(e => e.type == ContributorType.AUTHOR)) {
      
      throw new Error("Just one main author per paper!")
    }
   
    currentContributors.push(this.fb.group(new ContributorForm(contributor)))
    this.paperForm.next(currentPaper)
  }

  deleteContributor(i: number) {
    const currentPaper = this.paperForm.getValue()
    const currentContributors = currentPaper.get('contributors') as FormArray
    currentContributors.removeAt(i)
    this.paperForm.next(currentPaper)
  }

  getTopicsOption(): string[] {
    return ['Astronomy', 'Biology', 'Chemistry', 'Cognitive Science', 
    'Computer Science', 'Ecology', 'Geography', 'Geology', 'Linguistics', 'Physics',
    'Psychology', 'Sociology', 'Scatology', 'Zoology']
  }

}
