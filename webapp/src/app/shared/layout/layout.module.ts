import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { NavbarComponent } from './navbar/navbar.component'
import { FooterComponent } from './footer/footer.component'
import { ModalComponent } from '@app/shared/layout/modal/modal.component'
import { ModalModule } from 'ngx-bootstrap/modal'
import { CardlistComponent } from './cardlist/cardlist.component'
import { RouterModule } from '@angular/router'
import { UserLoggedNavbarComponent } from './navbar/user-logged-navbar/user-logged-navbar.component'
import { AlertModule } from 'ngx-bootstrap/alert'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { SearchBoxComponent } from './navbar/search-box/search-box.component'
import { CollapseModule } from 'ngx-bootstrap/collapse'

@NgModule({
    declarations: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      CardlistComponent,
      UserLoggedNavbarComponent,
      SearchBoxComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      ModalModule.forRoot(),
      BsDropdownModule.forRoot(),
      AlertModule.forRoot(),
      PopoverModule.forRoot(),
      CollapseModule.forRoot()
    ],
    exports: [
      FooterComponent,
      ModalComponent,
      NavbarComponent,
      CardlistComponent,
      ModalModule,
      AlertModule
    ],
    providers: [],
})
export class LayoutModule { }
