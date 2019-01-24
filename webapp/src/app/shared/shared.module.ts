import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LayoutModule } from './layout/layout.module'
import { TimeAgoPipe } from 'time-ago-pipe'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TagInputModule } from 'ngx-chips'

@NgModule({
  imports: [
    CommonModule,
    TagInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
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
    TimeAgoPipe
  ],

})
export class SharedModule { }
