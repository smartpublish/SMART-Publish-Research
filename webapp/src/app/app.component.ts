import { Component, OnInit } from '@angular/core';
import { ContributorService } from "./core/services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webapp';
  account = '';
  balance = '';

  constructor(private contributorService: ContributorService) {

  }

  ngOnInit() {
    let that = this;
    this.contributorService.getAccountInfo().then(function(acctInfo : any){
      console.log(acctInfo);
      that.account = acctInfo.fromAccount;
      that.balance = acctInfo.balance;
    }).catch(function(error){
      console.log(error);
    });
  }
}
