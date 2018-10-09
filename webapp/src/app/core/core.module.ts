import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './components/alert/alert.component';
import { AlertService } from "@app/core/services/alert.service";
import { EthereumService } from "@app/core/services/ethereum.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent
  ],
  providers: [
    AlertService,
    EthereumService
  ],
  exports: [
    AlertComponent
  ]
})
export class CoreModule { }
