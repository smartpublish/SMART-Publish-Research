import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CoreRoutingModule } from './core-routing.module'
import { AlertComponent } from './components/alert/alert.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { 
  AlertService, 
  AuthenticationService, 
  EthereumService, 
  IpfsService,
  ContributorService,
  HashService,
  FileService
 } from "./services";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CoreRoutingModule
  ],
  declarations: [
    AlertComponent,
    NotFoundComponent,
    ProfileComponent
  ],
  providers: [
    AlertService,
    AuthenticationService,
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
