import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from "@app/core/services/alert.service";
import { EthereumService } from "@app/core/services/ethereum.service";
import { IpfsService } from "@app/core/services/ipfs.service";
import { ContributorService } from "@app/core/services";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    AlertService,
    EthereumService,
    IpfsService,
    ContributorService
  ],
  exports: [
    AlertComponent
  ]
})
export class CoreModule { }
