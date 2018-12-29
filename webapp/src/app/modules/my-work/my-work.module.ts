import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkComponent } from './pages/work/work.component';
import { MyWorkRoutingModule } from './my-work-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MyWorkRoutingModule
  ],
  declarations: [WorkComponent]
})
export class MyWorkModule { }
