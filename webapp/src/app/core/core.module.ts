import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';
import { CoreRoutingModule } from './core-routing.module'
import { AlertComponent } from './components/alert/alert.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AlertModule } from 'ngx-bootstrap/alert';
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
    CoreRoutingModule,
    HttpClientModule ,
    AlertModule.forRoot()
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
