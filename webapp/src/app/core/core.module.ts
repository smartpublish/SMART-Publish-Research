import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AlertComponent} from './components/alert/alert.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AlertService} from "@app/core/services/alert.service";
import {EthereumService} from "@app/core/services/ethereum.service";
import {IpfsService} from "@app/core/services/ipfs.service";
import {ContributorService} from "@app/core/services";
import {HashService} from "@app/core/services/hash.service";
import {FileService} from "@app/core/services/file.service";

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
    ContributorService,
    HashService,
    FileService
  ],
  exports: [
    AlertComponent,
    NotFoundComponent
  ]
})
export class CoreModule {
}
