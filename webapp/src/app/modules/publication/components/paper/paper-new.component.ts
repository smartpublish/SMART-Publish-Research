import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ContributorService } from "@app/core/services";
import { PublicationService } from "@app/modules/publication/services/publication.service";
import { Paper } from "@app/modules/publication/models/paper.model";
import { AlertService } from "@app/core/services/alert.service";

@Component({
  selector: 'app-paper-new',
  templateUrl: './paper-new.component.html',
  styleUrls: ['./paper-new.component.scss']
})
export class PaperNewComponent implements OnInit {

  form: FormGroup;
  ethAccount: FormControl = new FormControl('', Validators.required);
  title: FormControl = new FormControl('', Validators.required);
  abstract: FormControl = new FormControl('', Validators.required);

  file: File;

  constructor(
    private contributorService: ContributorService,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder) {

    this.form = fb.group({
      title: this.title,
      abstract: this.abstract,
      ethAccount: this.ethAccount,
      file: ['', Validators.required]
      // TODO Contributors, Organizations
    });
  }

  onFileChange($event) {
    this.file = $event.target.files[0];
  }

  onSubmit() {
    let paper: Paper = new Paper(this.title.value, this.abstract.value, this.file);

    this.publicationService.submit(paper).then((paper:Paper) => {
      this.router.navigate(['/detail', paper.ethAddress]);
      this.alertService.success("Congratulation! Your paper was submitted correctly. Just wait for reviewers");
    }).catch((error) => {
      this.alertService.error(error);
    });
  }

  ngOnInit() {
    let that = this;
    this.contributorService.getAccountInfo().then(function(acctInfo : any){
      that.ethAccount.setValue(acctInfo.fromAccount + " (" + acctInfo.balance + " ethers.)");
    }).catch(function(error){
      console.log(error);
    });
  }

}
