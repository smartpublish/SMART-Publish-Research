import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { TimeAgoPipe } from 'time-ago-pipe';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule
  ],
  declarations: [
    TimeAgoPipe
  ],
  exports: [
    LayoutModule,
    TimeAgoPipe
  ],

})
export class SharedModule { }
