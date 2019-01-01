import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormArray } from "@angular/forms";
import { PublicationService } from "@app/modules/publication/services/publication.service";
import { Paper } from "@app/modules/publication/models/paper.model";
import { AlertService } from "@app/core/services/alert.service";
import { Subscription } from 'rxjs';
import { PublicationFormService } from '../../services/publication-form.service';
import { environment } from '@env/environment';
import { EmailService } from '@app/core/services/email.service';

@Component({
  selector: 'app-paper-new',
  templateUrl: './paper-new.component.html',
  styleUrls: ['./paper-new.component.scss']
})
export class PaperNewComponent implements OnInit {

  paperForm: FormGroup;
  paperFormSub: Subscription;
  contributorsForm: FormArray;
  formInvalid: boolean = false;
  file: File;

  constructor(
    private publicationService: PublicationService,
    private publicationFormService: PublicationFormService,
    private alertService: AlertService,
    private router: Router,
    private emailService: EmailService) {
  }

  onFileChange($event) {
    this.file = $event.target.files[0] 
  }

  onSubmit() {
    this.publicationService.submit(
      this.paperForm.get('title').value,
      this.paperForm.get('abstract').value,
      this.paperForm.get('keywords').value,
      this.file
    ).then((paper:Paper) => {
      this.paperForm.reset()
      this.router.navigate(['/detail', paper.ethAddress])
      this.alertService.success("Congratulation! Your paper was submitted correctly. Just wait for reviewers")
    }).catch((error) => {
      this.alertService.error(error)
    });
  }

  ngOnInit() {
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
