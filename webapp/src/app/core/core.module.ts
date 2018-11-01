import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from "@app/core/services/alert.service";
import { EthereumService } from "@app/core/services/ethereum.service";
import { IpfsService } from "@app/core/services/ipfs.service";
import { ContributorService } from "@app/core/services";
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    AlertComponent,
    NotFoundComponent
  ],
  providers: [
    AlertService,
    EthereumService,
    IpfsService,
    ContributorService
  ],
  exports: [
    AlertComponent,
    NotFoundComponent
  ]
})
export class CoreModule { }
