import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ModalComponent } from "@app/shared/layout/modal/modal.component";
import { ModalModule } from 'ngx-bootstrap/modal';
import { CardlistComponent } from './cardlist/cardlist.component';
import { RouterModule } from "@angular/router";
import { UserLoggedNavbarComponent } from './navbar/user-logged-navbar/user-logged-navbar.component';

@NgModule({
    declarations: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      CardlistComponent,
      UserLoggedNavbarComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      ModalModule.forRoot(),
      BsDropdownModule.forRoot()
    ],
    exports: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      CardlistComponent
    ],
    providers: [],
})
export class LayoutModule { }
