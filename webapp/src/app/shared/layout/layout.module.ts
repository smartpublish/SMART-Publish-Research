import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from "@app/shared/layout/modal/modal.component";
import { ModalModule } from 'ngx-bootstrap';
import { ShowcaseComponent } from './showcase/showcase.component';
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      ShowcaseComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      ModalModule.forRoot(),
    ],
    exports: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      ShowcaseComponent
    ],
    providers: [],
})
export class LayoutModule { }
