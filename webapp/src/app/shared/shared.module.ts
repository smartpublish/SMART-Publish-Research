import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from './layout/layout.module'
import { TimeAgoPipe } from 'time-ago-pipe'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TagInputModule } from 'ngx-chips'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFileInvoice, faUsers, faSave, faUserTimes } from '@fortawesome/free-solid-svg-icons'

@NgModule({
  imports: [
    CommonModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    FontAwesomeModule
  ],
  declarations: [
    TimeAgoPipe
  ],
  exports: [
    CommonModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    TimeAgoPipe,
    FontAwesomeModule
  ],

})
export class SharedModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add(faFileInvoice, faUsers, faSave, faUserTimes)
  }
}
