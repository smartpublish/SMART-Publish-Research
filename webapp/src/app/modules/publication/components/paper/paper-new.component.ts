import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
  locationFile: FormControl = new FormControl('', Validators.required); // TODO Refactory by uploader file

  constructor(
    private contributorService: ContributorService,
    private publicationService: PublicationService,
    private alertService: AlertService,
    private fb: FormBuilder) {

    this.form = fb.group({
      title: this.title,
      abstract: this.abstract,
      ethAccount: this.ethAccount,
      locationFile: this.locationFile
      // TODO Contributors, Organizations
    });
  }

  onSubmit() {
    let paper: Paper = new Paper(this.title.value, this.abstract.value, this.locationFile.value);
    console.log(this.publicationService);
    let that = this;
    this.publicationService.submit(paper).then(function (result) {
      console.log(result);
      that.alertService.success("Your paper is registered! Just wait for reviewers");
    }).catch(function (error) {
      that.alertService.error(error);
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
